// ================= IMPORTS =================
import { db } from "./firebase.js";
import { collection, addDoc, serverTimestamp } 
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// ================= FORM ELEMENTS =================
const form = document.getElementById("quoteForm");
const messageBox = document.getElementById("formMessage");
const submitBtn = document.getElementById("submitBtn");

// ================= SUBMIT HANDLER =================
if (form) {

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Disable button & show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = "Submitting...";

    // Collect checked extras
    const extras = [];
    document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked')
      .forEach(cb => extras.push(cb.value));

    try {

      await addDoc(collection(db, "quotes"), {

        // 🔥 Aligned with Admin Dashboard
        fullName: document.getElementById("fullname").value,
        email: document.getElementById("email").value,
        company: document.getElementById("company").value,
        phone: document.getElementById("phone").value,

        shipmentType: document.getElementById("shipment-type").value,
        service: document.getElementById("service").value,

        pickupLocation: document.getElementById("origin").value,
        deliveryLocation: document.getElementById("destination").value,

        weight: document.getElementById("weight").value,
        dimensions: document.getElementById("dimensions").value,
        cargo: document.getElementById("cargo").value,

        additionalServices: extras,

        status: "pending", // lowercase for consistency
        createdAt: serverTimestamp()

      });

      // Success Message
      messageBox.innerHTML = 
        "✅ Quote submitted successfully! We’ll respond within 2 hours.";
      messageBox.className = "form-message success";

      form.reset();

    } catch (error) {

      console.error(error);

      messageBox.innerHTML = 
        "❌ Something went wrong. Please try again.";
      messageBox.className = "form-message error";

    }

    // Restore button
    submitBtn.disabled = false;
    submitBtn.innerHTML = 
      `<i class="fa-solid fa-calculator"></i> Get My Quote`;
  });

}
