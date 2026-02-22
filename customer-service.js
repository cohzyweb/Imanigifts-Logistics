import { db } from "./firebase.js";
import {
  collection,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

/* ================= ELEMENTS ================= */
const tableBody = document.getElementById("ticketsTableBody");

const totalTickets = document.getElementById("totalTickets");
const openTickets = document.getElementById("openTickets");
const resolvedTickets = document.getElementById("resolvedTickets");
const aiEscalations = document.getElementById("aiEscalations");

/* ================= REAL-TIME QUERY ================= */
const q = query(collection(db, "tickets"), orderBy("createdAt", "desc"));

onSnapshot(q, (snapshot) => {

  tableBody.innerHTML = "";

  let total = 0;
  let open = 0;
  let resolved = 0;
  let escalations = 0;

  snapshot.forEach((docSnap) => {

    const data = docSnap.data();
    total++;

    if (data.status === "Open") open++;
    if (data.status === "Resolved") resolved++;
    if (data.aiEscalation === true) escalations++;

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${data.ticketId || "-"}</td>
      <td>${data.customerName || "-"}</td>
      <td>${data.subject || "-"}</td>
      <td>
        <span class="badge ${getSentimentClass(data.sentiment)}">
          ${data.sentiment || "Neutral"}
        </span>
      </td>
      <td>
        <span class="badge ${getPriorityClass(data.priority)}">
          ${data.priority || "Medium"}
        </span>
      </td>
      <td>
        <span class="badge ${getStatusClass(data.status)}">
          ${data.status || "Open"}
        </span>
      </td>
      <td>
        <button class="btn btn-primary"
          onclick="window.location='ticket-details.html?id=${docSnap.id}'">
          View
        </button>
      </td>
    `;

    tableBody.appendChild(tr);

  });

  // Update live stats
  totalTickets.textContent = total;
  openTickets.textContent = open;
  resolvedTickets.textContent = resolved;
  aiEscalations.textContent = escalations;

});

/* ================= BADGE HELPERS ================= */
function getSentimentClass(value) {

  switch ((value || "").toLowerCase()) {
    case "angry":
      return "delayed";
    case "neutral":
      return "transit";
    case "positive":
      return "delivered";
    default:
      return "transit";
  }

}

function getPriorityClass(value) {

  switch ((value || "").toLowerCase()) {
    case "high":
      return "delayed";
    case "medium":
      return "transit";
    case "low":
      return "delivered";
    default:
      return "transit";
  }

}

function getStatusClass(value) {

  switch ((value || "").toLowerCase()) {
    case "resolved":
      return "delivered";
    case "open":
      return "pending";
    default:
      return "pending";
  }

}
