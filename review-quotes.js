import { db } from "./firebase.js";
import {
  doc,
  onSnapshot,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

/* ================= GET QUOTE ID ================= */
const params = new URLSearchParams(window.location.search);
const quoteId = params.get("id");

if (!quoteId) {
  alert("No quote selected.");
  throw new Error("Missing quote ID");
}

const docRef = doc(db, "quotes", quoteId);

/* ================= GET ELEMENTS ================= */
const form = document.getElementById("quoteForm");

const customerName = document.getElementById("customerName");
const customerEmail = document.getElementById("customerEmail");
const customerPhone = document.getElementById("customerPhone");
const route = document.getElementById("route");
const shipmentType = document.getElementById("shipmentType");
const weight = document.getElementById("weight");
const cargo = document.getElementById("cargo");

const basePrice = document.getElementById("base_price");
const vatAmount = document.getElementById("vat_amount");
const totalAmount = document.getElementById("total_amount");
const status = document.getElementById("status");
const estimatedTime = document.getElementById("estimatedTime");
const notes = document.getElementById("notes");

/* ================= REAL-TIME LISTENER ================= */
let isUpdating = false; // prevents overwrite while typing

onSnapshot(docRef, (docSnap) => {

  if (!docSnap.exists()) {
    alert("Quote not found.");
    return;
  }

  if (isUpdating) return; // prevent UI flicker during update

  const data = docSnap.data();

  customerName.value = data.fullName || "";
  customerEmail.value = data.email || "";
  customerPhone.value = data.phone || "";

  route.value =
    `${data.pickupLocation || ""} → ${data.deliveryLocation || ""}`;

  shipmentType.value = data.shipmentType || "";
  weight.value = data.weight || "";
  cargo.value = data.cargo || "";

  basePrice.value = data.basePrice ?? "";
  vatAmount.value = data.vat ?? "";
  totalAmount.value = data.total ?? "";
  status.value = data.status || "pending";
  estimatedTime.value = data.estimatedTime || "";
  notes.value = data.notes || "";

});

/* ================= VAT AUTO CALC ================= */
basePrice.addEventListener("input", () => {

  const value = parseFloat(basePrice.value) || 0;
  const vat = value * 0.20;
  const total = value + vat;

  vatAmount.value = vat.toFixed(2);
  totalAmount.value = total.toFixed(2);

});

/* ================= UPDATE QUOTE ================= */
form.addEventListener("submit", async (e) => {

  e.preventDefault();

  try {

    isUpdating = true;

    await updateDoc(docRef, {
      basePrice: parseFloat(basePrice.value) || 0,
      vat: parseFloat(vatAmount.value) || 0,
      total: parseFloat(totalAmount.value) || 0,
      status: status.value.toLowerCase(),
      estimatedTime: estimatedTime.value,
      notes: notes.value,
      updatedAt: serverTimestamp()
    });

    alert("✅ Quote updated successfully!");

  } catch (error) {
    console.error(error);
    alert("❌ Failed to update quote.");
  }

  isUpdating = false;

});
