import { signOut }
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

import { auth } from "./firebase.js";

document.addEventListener("DOMContentLoaded", () => {

  const logoutBtn = document.getElementById("logoutBtn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      await signOut(auth);
      window.location.replace("login.html");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Error logging out: " + error.message);
    }
  });

});
