import { auth } from "./firebase-config.js";

import { onAuthStateChanged }
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.replace("login.html");
  }

});
