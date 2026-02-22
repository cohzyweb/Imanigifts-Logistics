import { db } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

/* ================= DOCUMENT REF ================= */
const settingsRef = doc(db, "system", "settings");

/* ================= LOAD SETTINGS LIVE ================= */
onSnapshot(settingsRef, (docSnap) => {

  if (!docSnap.exists()) return;

  const data = docSnap.data();

  // Company
  companyName.value = data.companyName || "";
  supportEmail.value = data.supportEmail || "";
  contactNumber.value = data.contactNumber || "";
  companyAddress.value = data.companyAddress || "";

  // Notifications
  notifyQuotes.checked = data.notifyQuotes || false;
  notifyTickets.checked = data.notifyTickets || false;
  notifySMS.checked = data.notifySMS || false;

  // AI
  aiEnabled.value = data.aiEnabled || "Enabled";
  aiTone.value = data.aiTone || "Professional";
  aiEscalation.value = data.aiEscalation || "High & Angry Sentiment";
  aiApiKey.value = data.aiApiKey || "";

});

/* ================= SAVE COMPANY ================= */
saveCompanyBtn.addEventListener("click", async () => {

  await setDoc(settingsRef, {
    companyName: companyName.value,
    supportEmail: supportEmail.value,
    contactNumber: contactNumber.value,
    companyAddress: companyAddress.value
  }, { merge: true });

  alert("Company settings saved!");
});

/* ================= SAVE NOTIFICATIONS ================= */
saveNotificationsBtn.addEventListener("click", async () => {

  await setDoc(settingsRef, {
    notifyQuotes: notifyQuotes.checked,
    notifyTickets: notifyTickets.checked,
    notifySMS: notifySMS.checked
  }, { merge: true });

  alert("Notification settings saved!");
});

/* ================= SAVE AI ================= */
saveAiBtn.addEventListener("click", async () => {

  await setDoc(settingsRef, {
    aiEnabled: aiEnabled.value,
    aiTone: aiTone.value,
    aiEscalation: aiEscalation.value,
    aiApiKey: aiApiKey.value
  }, { merge: true });

  alert("AI settings saved!");
});
