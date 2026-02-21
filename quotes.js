import { db } from "./firebase.js";
import {
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

/* ================= ELEMENTS ================= */
const tableBody = document.getElementById("quotesTableBody");
const searchInput = document.getElementById("searchInput");

/* ================= DATA STORAGE ================= */
let allQuotes = [];

/* ================= FETCH QUOTES ================= */
async function fetchQuotes() {
  try {

    const q = query(collection(db, "quotes"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    allQuotes = snapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...docSnap.data()
    }));

    renderTable(allQuotes);

  } catch (error) {
    console.error("Error fetching quotes:", error);
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
        <a href="quote-details.html?id=${quote.id}" class="view-btn">
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

  const filtered = allQuotes.filter(q => {

    return (
      q.fullName?.toLowerCase().includes(value) ||
      q.email?.toLowerCase().includes(value) ||
      q.pickupLocation?.toLowerCase().includes(value) ||
      q.deliveryLocation?.toLowerCase().includes(value)
    );

  });

  renderTable(filtered);

});

/* ================= INITIAL LOAD ================= */
fetchQuotes();
