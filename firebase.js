import { initializeApp } 
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";

import { getAuth } 
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

import { getFirestore } 
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

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

export const auth = getAuth(app);
export const db = getFirestore(app);
