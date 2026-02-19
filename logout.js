import { getAuth, signOut } from 
"https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const auth = getAuth();

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    try {
      await signOut(auth);
      window.location.href = "login.html";
    } catch (error) {
      alert("Error logging out: " + error.message);
    }
  });
}
