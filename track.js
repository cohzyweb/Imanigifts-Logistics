import { db } from "./firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const form = document.getElementById("trackingForm");
const trackingInput = document.getElementById("trackingNumber");
const resultBox = document.getElementById("trackingResult");

const statusBadge = document.getElementById("statusBadge");
const displayTrackingId = document.getElementById("displayTrackingId");
const displayOrigin = document.getElementById("displayOrigin");
const displayDestination = document.getElementById("displayDestination");
const displayETA = document.getElementById("displayETA");
const displayTotal = document.getElementById("displayTotal");

let unsubscribe = null;

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const trackingNumber = trackingInput.value.trim();

  if (!trackingNumber) return;

  const q = query(
    collection(db, "quotes"),
    where("trackingNumber", "==", trackingNumber)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    alert("Tracking number not found.");
    return;
  }

  const docRef = snapshot.docs[0].ref;

  // Stop previous listener if exists
  if (unsubscribe) unsubscribe();

  unsubscribe = onSnapshot(docRef, (docSnap) => {
    const data = docSnap.data();

    resultBox.style.display = "block";

    displayTrackingId.textContent = trackingNumber;
    displayOrigin.textContent = data.pickupLocation || "-";
    displayDestination.textContent = data.deliveryLocation || "-";
    displayETA.textContent = data.estimatedTime || "Pending update";
    displayTotal.textContent = data.total || "0";

    statusBadge.textContent = data.status?.toUpperCase() || "PENDING";

    // Dynamic color
    if (data.status === "approved") {
      statusBadge.style.background = "green";
    } else if (data.status === "rejected") {
      statusBadge.style.background = "red";
    } else {
      statusBadge.style.background = "orange";
    }
  });
});
