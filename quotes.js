import { db } from "./firebase.js";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

/* ================= ELEMENTS ================= */
const tableBody = document.getElementById("quotesTableBody");
const searchInput = document.getElementById("searchInput");
const badge = document.getElementById("pendingBadge");

/* ================= DATA STORAGE ================= */
let allQuotes = [];

/* ================= REAL-TIME FETCH ================= */
const q = query(
  collection(db, "quotes"),
  orderBy("createdAt", "desc")
);

onSnapshot(q, (snapshot) => {

  allQuotes = snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data()
  }));

  updateBadge();
  renderTable(allQuotes);

});

/* ================= BADGE COUNTER ================= */
function updateBadge() {

  const pendingCount = allQuotes.filter(q => q.status === "pending").length;

  if (pendingCount > 0) {
    badge.style.display = "inline-block";
    badge.textContent = pendingCount;
  } else {
    badge.style.display = "none";
  }

}

/* ================= RENDER TABLE ================= */
function renderTable(data) {

  tableBody.innerHTML = "";

  if (data.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;">
          No quote requests found.
        </td>
      </tr>
    `;
    return;
  }

  data.forEach(quote => {

    const tr = document.createElement("tr");

    const formattedDate = quote.createdAt?.toDate
      ? quote.createdAt.toDate().toLocaleDateString("en-GB")
      : "—";

    tr.innerHTML = `
      <td>
        <strong>${quote.fullName || "—"}</strong><br>
        <small>${quote.email || ""}</small>
      </td>

      <td>
        ${quote.pickupLocation || "—"} → ${quote.deliveryLocation || "—"}
      </td>

      <td>${quote.shipmentType || "—"}</td>

      <td>
        <select class="status-select" data-id="${quote.id}">
          <option value="pending" ${quote.status === "pending" ? "selected" : ""}>Pending</option>
          <option value="quoted" ${quote.status === "quoted" ? "selected" : ""}>Quoted</option>
          <option value="completed" ${quote.status === "completed" ? "selected" : ""}>Completed</option>
        </select>
      </td>

      <td>${formattedDate}</td>

      <td>
        <a href="review-quotes.html?id=${quote.id}" class="view-btn">
          View
        </a>
      </td>
    `;

    tableBody.appendChild(tr);
  });

  attachStatusListeners();
}

/* ================= STATUS UPDATE ================= */
function attachStatusListeners() {

  document.querySelectorAll(".status-select").forEach(select => {

    select.addEventListener("change", async (e) => {

      const id = e.target.dataset.id;
      const newStatus = e.target.value;

      try {

        await updateDoc(doc(db, "quotes", id), {
          status: newStatus
        });

      } catch (error) {
        console.error("Status update failed:", error);
      }

    });

  });

}

/* ================= SEARCH FUNCTION ================= */
searchInput.addEventListener("input", () => {

  const value = searchInput.value.toLowerCase();

  const filtered = allQuotes.filter(q =>
    q.fullName?.toLowerCase().includes(value) ||
    q.email?.toLowerCase().includes(value) ||
    q.pickupLocation?.toLowerCase().includes(value) ||
    q.deliveryLocation?.toLowerCase().includes(value)
  );

  renderTable(filtered);

});
