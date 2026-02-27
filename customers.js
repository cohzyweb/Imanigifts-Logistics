import { app } from "./firebase-config.js";

import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    doc,
    updateDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const db = getFirestore(app);
const customersRef = collection(db, "customers");

/* ================= ELEMENTS ================= */
const tableBody = document.getElementById("customersTableBody");

const totalCustomers = document.getElementById("totalCustomers");
const activeCustomers = document.getElementById("activeCustomers");
const inactiveCustomers = document.getElementById("inactiveCustomers");
const vipCustomers = document.getElementById("vipCustomers");

const saveBtn = document.getElementById("saveCustomerBtn");
const openModalBtn = document.getElementById("openAddCustomer");
const closeModalBtn = document.getElementById("closeCustomerModal");
const modal = document.getElementById("addCustomerModal");

const searchInput = document.getElementById("searchCustomer");

let allCustomers = [];

/* ================= REAL-TIME LISTENER ================= */
onSnapshot(customersRef, (snapshot) => {

    allCustomers = [];
    tableBody.innerHTML = "";

    let active = 0;
    let inactive = 0;
    let vip = 0;

    snapshot.forEach((docSnap) => {

        const data = docSnap.data();
        const id = docSnap.id;

        allCustomers.push({ id, ...data });

        if (data.status === "Active") active++;
        if (data.status === "Inactive") inactive++;
        if (data.status === "VIP") vip++;

    });

    renderTable(allCustomers);

    totalCustomers.textContent = snapshot.size;
    activeCustomers.textContent = active;
    inactiveCustomers.textContent = inactive;
    vipCustomers.textContent = vip;

});

/* ================= RENDER TABLE ================= */
function renderTable(data) {

    tableBody.innerHTML = "";

    data.forEach(customer => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${customer.name || "-"}</td>
            <td>${customer.email || "-"}</td>
            <td>${customer.phone || "-"}</td>
            <td>${customer.shipments || 0}</td>
            <td>
                <select onchange="updateCustomerStatus('${customer.id}', this.value)">
                    <option ${customer.status === "Active" ? "selected" : ""}>Active</option>
                    <option ${customer.status === "Inactive" ? "selected" : ""}>Inactive</option>
                    <option ${customer.status === "VIP" ? "selected" : ""}>VIP</option>
                </select>
            </td>
            <td>
                <button onclick="deleteCustomer('${customer.id}')" class="btn btn-danger">
                    Delete
                </button>
            </td>
        `;

        tableBody.appendChild(tr);

    });

}

/* ================= ADD CUSTOMER ================= */
saveBtn?.addEventListener("click", async () => {

    const name = document.getElementById("customerName").value.trim();
    const email = document.getElementById("customerEmail").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const status = document.getElementById("customerStatus").value;

    if (!name || !email) {
        alert("Name and Email required");
        return;
    }

    try {

        await addDoc(customersRef, {
            name,
            email,
            phone,
            status,
            shipments: 0,
            createdAt: serverTimestamp()
        });

        // Reset form
        document.getElementById("customerName").value = "";
        document.getElementById("customerEmail").value = "";
        document.getElementById("customerPhone").value = "";
        document.getElementById("customerStatus").value = "Active";

        modal.style.display = "none";

    } catch (error) {
        console.error("Error adding customer:", error);
    }

});

/* ================= UPDATE STATUS ================= */
window.updateCustomerStatus = async (id, newStatus) => {
    await updateDoc(doc(db, "customers", id), {
        status: newStatus
    });
};

/* ================= DELETE CUSTOMER ================= */
window.deleteCustomer = async (id) => {

    if (!confirm("Delete this customer?")) return;

    await deleteDoc(doc(db, "customers", id));
};

/* ================= MODAL CONTROL ================= */
openModalBtn?.addEventListener("click", () => {
    modal.style.display = "flex";
});

closeModalBtn?.addEventListener("click", () => {
    modal.style.display = "none";
});

/* ================= SEARCH ================= */
searchInput?.addEventListener("input", (e) => {

    const value = e.target.value.toLowerCase();

    const filtered = allCustomers.filter(c =>
        c.name?.toLowerCase().includes(value) ||
        c.email?.toLowerCase().includes(value)
    );

    renderTable(filtered);

});