import { db } from "./firebase.js";
import {
  collection,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// ===== STATS ELEMENTS =====
const totalShipmentsEl = document.getElementById("totalShipments");
const pendingQuotesEl = document.getElementById("pendingQuotes");
const activeCustomersEl = document.getElementById("activeCustomers");
const monthlyRevenueEl = document.getElementById("monthlyRevenue");

const recentQuotesBody = document.getElementById("recentQuotesBody");

// =============================
// REAL-TIME QUOTES LISTENER
// =============================

const quotesQuery = query(
  collection(db, "quotes"),
  orderBy("createdAt", "desc")
);

onSnapshot(quotesQuery, (snapshot) => {

  recentQuotesBody.innerHTML = "";

  let pendingCount = 0;

  snapshot.forEach((doc) => {
    const data = doc.data();

    if (!data.status || data.status === "Pending") {
      pendingCount++;
    }
  });

  pendingQuotesEl.textContent = pendingCount;

  // Show only latest 5
  snapshot.docs.slice(0, 5).forEach((doc) => {
    const data = doc.data();

    const row = `
      <tr>
        <td>
          ${data.fullname || "-"} <br>
          <small>${data.email || "-"}</small>
        </td>
        <td>${data.origin || "-"} → ${data.destination || "-"}</td>
        <td>${data.shipmentType || "-"}</td>
        <td>
          <span class="badge pending">
            ${data.status || "Pending"}
          </span>
        </td>
        <td>
          <a href="review-quotes.html?id=${doc.id}" 
             class="btn btn-primary">
             Review
          </a>
        </td>
      </tr>
    `;

    recentQuotesBody.innerHTML += row;
  });

});

// =============================
// SHIPMENTS COUNT
// =============================

onSnapshot(collection(db, "shipments"), (snapshot) => {
  totalShipmentsEl.textContent = snapshot.size;
});

// =============================
// CUSTOMERS COUNT
// =============================

onSnapshot(collection(db, "customers"), (snapshot) => {
  activeCustomersEl.textContent = snapshot.size;
});

// =============================
// REVENUE (from approved quotes)
// =============================

onSnapshot(collection(db, "quotes"), (snapshot) => {

  let total = 0;

  snapshot.forEach((doc) => {
    const data = doc.data();

    if (data.status === "Approved" && data.price) {
      total += Number(data.price);
    }
  });

  monthlyRevenueEl.textContent = "£" + total.toLocaleString();
});
