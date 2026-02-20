import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCiGw3eONWoqxItZt1dNAuOhHr-lUMbBV8",
  authDomain: "imanigifts-logistics.firebaseapp.com",
  projectId: "imanigifts-logistics",
  storageBucket: "imanigifts-logistics.appspot.com",
  messagingSenderId: "841177758464",
  appId: "1:841177758464:web:60b5890ec5702d371dd1e5",
  measurementId: "G-CGQ28X85EL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("quoteForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const service = document.getElementById("service").value;
  const message = document.getElementById("message").value;

  try {
    await addDoc(collection(db, "quotes"), {
      name,
      email,
      service,
      message,
      status: "pending",
      createdAt: serverTimestamp()
    });

    alert("Quote submitted successfully!");
    form.reset();

  } catch (error) {
    alert("Error submitting quote.");
    console.error(error);
  }
});
