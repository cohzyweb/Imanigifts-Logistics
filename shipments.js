import { db } from "./firebase.js";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

/* ================= ELEMENTS ================= */
const tableBody = document.getElementById("shipmentsTableBody");
const totalShipmentsCard = document.getElementById("totalShipments");
const inTransitCard = document.getElementById("inTransit");
const deliveredCard = document.getElementById("delivered");
const delayedCard = document.getElementById("delayed");
const searchInput = document.getElementById("searchInput");

const createShipmentBtn = document.getElementById("createShipmentBtn");
const newCustomer = document.getElementById("newCustomer");
const newRoute = document.getElementById("newRoute");
const newType = document.getElementById("newType");
const newDate = document.getElementById("newDate");

/* ================= PAGINATION ================= */
const rowsPerPage = 5;
let currentPage = 1;
let allShipments = [];

/* ================= REAL-TIME QUERY ================= */
const q = query(collection(db, "shipments"), orderBy("createdAt", "desc"));

onSnapshot(q, (snapshot) => {

  allShipments = [];

  let total = 0;
  let inTransit = 0;
  let delivered = 0;
  let delayed = 0;

  snapshot.forEach((docSnap) => {

    const data = docSnap.data();
    const id = docSnap.id;

    total++;

    const status = (data.status || "Pending").toLowerCase();

    if (status === "in transit") inTransit++;
    if (status === "delivered") delivered++;
    if (status === "delayed") delayed++;

    allShipments.push({ id, ...data });

  });

  renderPage(currentPage);

  totalShipmentsCard.textContent = total;
  inTransitCard.textContent = inTransit;
  deliveredCard.textContent = delivered;
  delayedCard.textContent = delayed;

});

/* ================= UK TRACKING GENERATOR ================= */
function generateTrackingId() {
  const date = new Date();
  const y = date.getFullYear().toString().slice(-2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(100000 + Math.random() * 900000);
  return `IGL-UK-${y}${m}${d}-${random}`;
}

/* ================= CREATE SHIPMENT ================= */
createShipmentBtn?.addEventListener("click", async () => {

  const customerName = newCustomer.value.trim();
  const route = newRoute.value.trim();
  const shipmentType = newType.value;
  const estimatedDelivery = newDate.value;

  if (!customerName || !route || !estimatedDelivery) {
    alert("Please fill all fields");
    return;
  }

  try {

    await addDoc(collection(db, "shipments"), {
      trackingId: generateTrackingId(),
      customerName,
      route,
      shipmentType,
      estimatedDelivery,
      status: "In Transit",
      createdAt: serverTimestamp()
    });

    newCustomer.value = "";
    newRoute.value = "";
    newDate.value = "";

    document.getElementById("shipmentModal").style.display = "none";

  } catch (error) {
    console.error("Error creating shipment:", error);
  }

});

/* ================= RENDER PAGE ================= */
function renderPage(page) {

  tableBody.innerHTML = "";

  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedItems = allShipments.slice(start, end);

  paginatedItems.forEach((shipment) => {

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${shipment.trackingId}</td>
      <td>${shipment.customerName}</td>
      <td>${shipment.route}</td>
      <td>${shipment.shipmentType}</td>
      <td>
        <select onchange="updateStatus('${shipment.id}', this.value)"
          class="status-select">
          <option ${shipment.status === "In Transit" ? "selected" : ""}>
            In Transit
          </option>
          <option ${shipment.status === "Delivered" ? "selected" : ""}>
            Delivered
          </option>
          <option ${shipment.status === "Delayed" ? "selected" : ""}>
            Delayed
          </option>
        </select>
      </td>
      <td>${shipment.estimatedDelivery}</td>
      <td>
        <button onclick="deleteShipment('${shipment.id}')"
          class="btn btn-danger">
          Delete
        </button>
      </td>
    `;

    tableBody.appendChild(tr);

  });

  renderPagination();
}

/* ================= UPDATE STATUS ================= */
window.updateStatus = async (id, newStatus) => {
  await updateDoc(doc(db, "shipments", id), {
    status: newStatus
  });
};

/* ================= DELETE ================= */
window.deleteShipment = async (id) => {

  if (!confirm("Delete this shipment?")) return;

  await deleteDoc(doc(db, "shipments", id));
};

/* ================= SEARCH ================= */
searchInput?.addEventListener("input", () => {

  const value = searchInput.value.toLowerCase();

  const filtered = allShipments.filter(shipment =>
    shipment.trackingId?.toLowerCase().includes(value) ||
    shipment.customerName?.toLowerCase().includes(value) ||
    shipment.route?.toLowerCase().includes(value)
  );

  allShipments = filtered;
  currentPage = 1;
  renderPage(currentPage);

});

/* ================= PAGINATION CONTROLS ================= */
function renderPagination() {

  const pageCount = Math.ceil(allShipments.length / rowsPerPage);

  const paginationContainer = document.getElementById("pagination");

  if (!paginationContainer) return;

  paginationContainer.innerHTML = "";

  for (let i = 1; i <= pageCount; i++) {

    const btn = document.createElement("button");
    btn.textContent = i;
    btn.classList.add("page-btn");

    if (i === currentPage) {
      btn.classList.add("active-page");
    }

    btn.onclick = () => {
      currentPage = i;
      renderPage(currentPage);
    };

    paginationContainer.appendChild(btn);
  }

}