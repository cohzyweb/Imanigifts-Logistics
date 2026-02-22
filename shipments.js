import { db } from "./firebase.js";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

/* ================= ELEMENTS ================= */
const tableBody = document.getElementById("shipmentsTableBody");

const totalShipmentsCard = document.getElementById("totalShipments");
const inTransitCard = document.getElementById("inTransit");
const deliveredCard = document.getElementById("delivered");
const delayedCard = document.getElementById("delayed");

const searchInput = document.getElementById("searchInput");

/* ================= REAL-TIME QUERY ================= */
const q = query(collection(db, "shipments"), orderBy("createdAt", "desc"));

let allShipments = [];

onSnapshot(q, (snapshot) => {

  allShipments = [];
  tableBody.innerHTML = "";

  let total = 0;
  let inTransit = 0;
  let delivered = 0;
  let delayed = 0;

  snapshot.forEach((docSnap) => {

    const data = docSnap.data();
    const id = docSnap.id;

    total++;

    // Normalize status (important!)
    const status = (data.status || "Pending").toLowerCase();

    if (status === "in transit") inTransit++;
    if (status === "delivered") delivered++;
    if (status === "delayed") delayed++;

    allShipments.push({ id, ...data });

  });

  renderTable(allShipments);

  // Update live stats
  totalShipmentsCard.textContent = total;
  inTransitCard.textContent = inTransit;
  deliveredCard.textContent = delivered;
  delayedCard.textContent = delayed;

});

/* ================= RENDER TABLE ================= */
function renderTable(data) {

  tableBody.innerHTML = "";

  data.forEach((shipment) => {

    const tr = document.createElement("tr");

    const status = shipment.status || "Pending";

    tr.innerHTML = `
      <td>${shipment.trackingId || "-"}</td>
      <td>${shipment.customerName || "-"}</td>
      <td>${shipment.route || "-"}</td>
      <td>${shipment.shipmentType || "-"}</td>
      <td>
        <span class="badge ${getBadgeClass(status)}">
          ${status}
        </span>
      </td>
      <td>${shipment.estimatedDelivery || "-"}</td>
      <td>
        <button class="btn btn-primary"
          onclick="window.location='shipment-details.html?id=${shipment.id}'">
          Update
        </button>
      </td>
    `;

    tableBody.appendChild(tr);

  });

}

/* ================= SEARCH FUNCTION ================= */
searchInput?.addEventListener("input", () => {

  const value = searchInput.value.toLowerCase();

  const filtered = allShipments.filter(shipment =>
    shipment.trackingId?.toLowerCase().includes(value) ||
    shipment.customerName?.toLowerCase().includes(value) ||
    shipment.route?.toLowerCase().includes(value)
  );

  renderTable(filtered);

});

/* ================= BADGE CLASS ================= */
function getBadgeClass(status) {

  const normalized = status.toLowerCase();

  switch (normalized) {
    case "in transit":
      return "transit";
    case "delivered":
      return "delivered";
    case "delayed":
      return "pending";
    default:
      return "pending";
  }

}
