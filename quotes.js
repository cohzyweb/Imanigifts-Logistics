import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

const quotesTable = document.getElementById("quotesTable");

const q = query(collection(db, "quotes"), orderBy("createdAt", "desc"));

onSnapshot(q, (snapshot) => {
  quotesTable.innerHTML = "";

  snapshot.forEach((doc) => {
    const data = doc.data();

    quotesTable.innerHTML += `
      <tr>
        <td>${data.name}</td>
        <td>${data.email}</td>
        <td>${data.service}</td>
        <td>${data.message}</td>
        <td>${data.status}</td>
      </tr>
    `;
  });
});
