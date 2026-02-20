import { db } from "./firebase.js";
import { doc, getDoc, updateDoc } 
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

/* ================= GET QUOTE ID FROM URL ================= */
const params = new URLSearchParams(window.location.search);
const quoteId = params.get("id");

if (!quoteId) {
  alert("No quote selected.");
}

/* ================= LOAD QUOTE DATA ================= */
async function loadQuote() {

  const docRef = doc(db, "quotes", quoteId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {

    const data = docSnap.data();

    document.querySelector('input[label="Customer Name"]')?.value;
    
    document.querySelectorAll("input[readonly]")[0].value = data.fullname;
    document.querySelectorAll("input[readonly]")[1].value = data.email;
    document.querySelectorAll("input[readonly]")[2].value = data.phone;
    document.querySelectorAll("input[readonly]")[3].value =
      `${data.origin} → ${data.destination}`;
    document.querySelectorAll("input[readonly]")[4].value = data.shipmentType;
    document.querySelectorAll("input[readonly]")[5].value =
      `${data.weight} kg`;

    document.querySelector("textarea[readonly]").value = data.cargo;

  } else {
    alert("Quote not found.");
  }
}

loadQuote();

/* ================= VAT CALCULATION ================= */
const base = document.getElementById("base_price");
const vat = document.getElementById("vat_amount");
const total = document.getElementById("total_amount");

base?.addEventListener("input", function () {

  const value = parseFloat(this.value) || 0;
  const vatCalc = value * 0.20;
  const totalCalc = value + vatCalc;

  vat.value = vatCalc.toFixed(2);
  total.value = totalCalc.toFixed(2);

});

/* ================= SUBMIT QUOTE RESPONSE ================= */
const form = document.querySelector("form");

form?.addEventListener("submit", async (e) => {

  e.preventDefault();

  try {

    await updateDoc(doc(db, "quotes", quoteId), {
      basePrice: base.value,
      vat: vat.value,
      total: total.value,
      estimatedTime: form.querySelectorAll("input")[9].value,
      notes: form.querySelector("textarea").value,
      status: form.querySelector("select").value
    });

    alert("✅ Quote response sent!");

  } catch (error) {
    console.error(error);
    alert("❌ Failed to update.");
  }

});
