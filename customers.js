import { app } from "./firebase-config.js";

import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const db = getFirestore(app);

const customersRef = collection(db, "customers");

const tableBody = document.getElementById("customersTableBody");

const totalCustomers = document.getElementById("totalCustomers");
const activeCustomers = document.getElementById("activeCustomers");
const inactiveCustomers = document.getElementById("inactiveCustomers");
const vipCustomers = document.getElementById("vipCustomers");

let allCustomers = [];

/* ================= REAL-TIME LISTENER ================= */
onSnapshot(customersRef, (snapshot) => {

    tableBody.innerHTML = "";
    allCustomers = [];

    let active = 0;
    let inactive = 0;
    let vip = 0;

    snapshot.forEach((doc) => {

        const data = doc.data();
        allCustomers.push({ id: doc.id, ...data });

        if (data.status === "Active") active++;
        if (data.status === "Inactive") inactive++;
        if (data.status === "VIP") vip++;

        tableBody.innerHTML += `
            <tr>
                <td>${data.name}</td>
                <td>${data.email}</td>
                <td>${data.phone}</td>
                <td>${data.shipments || 0}</td>
                <td><span class="badge">${data.status}</span></td>
                <td>
                    <button class="btn btn-outline">View</button>
                    <button class="btn btn-primary">Edit</button>
                </td>
            </tr>
        `;
    });

    totalCustomers.textContent = snapshot.size;
    activeCustomers.textContent = active;
    inactiveCustomers.textContent = inactive;
    vipCustomers.textContent = vip;

});

/* ================= ADD CUSTOMER ================= */

const saveBtn = document.getElementById("saveCustomerBtn");

saveBtn.addEventListener("click", async () => {

    const name = document.getElementById("customerName").value;
    const email = document.getElementById("customerEmail").value;
    const phone = document.getElementById("customerPhone").value;
    const status = document.getElementById("customerStatus").value;

    if (!name || !email) {
        alert("Name and Email required");
        return;
    }

    await addDoc(customersRef, {
        name,
        email,
        phone,
        status,
        shipments: 0,
        createdAt: new Date()
    });

    document.getElementById("addCustomerModal").style.display = "none";
});

/* ================= MODAL CONTROL ================= */

document.getElementById("openAddCustomer")
.addEventListener("click", () => {
    document.getElementById("addCustomerModal").style.display = "flex";
});

document.getElementById("closeCustomerModal")
.addEventListener("click", () => {
    document.getElementById("addCustomerModal").style.display = "none";
});

/* ================= SEARCH ================= */

document.getElementById("searchCustomer")
.addEventListener("input", (e) => {

    const value = e.target.value.toLowerCase();

    const filtered = allCustomers.filter(c =>
        c.name.toLowerCase().includes(value) ||
        c.email.toLowerCase().includes(value)
    );

    tableBody.innerHTML = "";

    filtered.forEach(data => {
        tableBody.innerHTML += `
            <tr>
                <td>${data.name}</td>
                <td>${data.email}</td>
                <td>${data.phone}</td>
                <td>${data.shipments || 0}</td>
                <td><span class="badge">${data.status}</span></td>
                <td>
                    <button class="btn btn-outline">View</button>
                    <button class="btn btn-primary">Edit</button>
                </td>
            </tr>
        `;
    });

});
