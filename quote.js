import { db } from "./firebase.js";
import { collection, addDoc, serverTimestamp } 
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

const form = document.getElementById("quoteForm");

if (form) {

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const extras = [];
    document.querySelectorAll('input[type="checkbox"]:checked')
      .forEach(cb => extras.push(cb.value));

    try {

      await addDoc(collection(db, "quotes"), {
        fullname: document.getElementById("fullname").value,
        email: document.getElementById("email").value,
        company: document.getElementById("company").value,
        phone: document.getElementById("phone").value,
        shipmentType: document.getElementById("shipment-type").value,
        service: document.getElementById("service").value,
        origin: document.getElementById("origin").value,
        destination: document.getElementById("destination").value,
        weight: document.getElementById("weight").value,
        dimensions: document.getElementById("dimensions").value,
        cargo: document.getElementById("cargo").value,
        extras: extras,
        status: "Pending",
        createdAt: serverTimestamp()
      });

      alert("✅ Quote submitted successfully!");
      form.reset();

    } catch (error) {
      console.error(error);
      alert("❌ Something went wrong.");
    }

  });

}
