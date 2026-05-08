// ================= FORM ELEMENTS =================
const form = document.getElementById("quoteForm");
const messageBox = document.getElementById("formMessage");
const submitBtn = document.getElementById("submitBtn");

// ================= SUBMIT HANDLER =================
if (form) {

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    submitBtn.disabled = true;
    submitBtn.innerHTML = "Submitting...";

    // Collect checked extras
    const extras = [];
    document
      .querySelectorAll('.checkbox-group input[type="checkbox"]:checked')
      .forEach(cb => extras.push(cb.value));

    try {

      const response = await fetch(
        "https://your-railway-url.up.railway.app/api/quotes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({

            // ================= BASIC INFO =================
            fullName: document.getElementById("fullname")?.value || "",
            email: document.getElementById("email")?.value || "",
            company: document.getElementById("company")?.value || "",
            phone: document.getElementById("phone")?.value || "",

            shipmentType: document.getElementById("shipment-type")?.value || "",
            service: document.getElementById("service")?.value || "",

            pickupLocation: document.getElementById("origin")?.value || "",
            deliveryLocation: document.getElementById("destination")?.value || "",

            weight: document.getElementById("weight")?.value || "",
            dimensions: document.getElementById("dimensions")?.value || "",
            cargo: document.getElementById("cargo")?.value || "",

            additionalServices: extras,

            // ================= MOVING QUESTIONNAIRE =================
            packingResponsibility: document.getElementById("packing")?.value || "",
            materialsNeeded: document.getElementById("materials")?.value || "",
            furnitureDisassembly: document.getElementById("furniture")?.value || "",
            fragileItems: document.getElementById("fragile")?.value || "",

            floorLevels: document.getElementById("floors")?.value || "",
            elevator: document.getElementById("elevator")?.value || "",
            parking: document.getElementById("parking")?.value || "",
            walkingDistance: document.getElementById("distance")?.value || "",
            accessIssues: document.getElementById("access")?.value || "",

            onSiteSupervisor: document.getElementById("supervisor")?.value || "",
            extraHelp: document.getElementById("help")?.value || "",
            applianceHelp: document.getElementById("appliances")?.value || "",

            boxCount: document.getElementById("boxes")?.value || "",
            bulkyItems: document.getElementById("bulky")?.value || "",
            timing: document.getElementById("timing")?.value || "",
            storage: document.getElementById("storage")?.value || "",

            // Backend will set:
            // status: "pending"
            // createdAt: Date.now()

          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Server error");
      }

      // ================= SUCCESS =================
      messageBox.innerHTML =
        "✅ Quote submitted successfully! We’ll respond within 2 hours.";
      messageBox.className = "form-message success";

      form.reset();

    } catch (error) {

      console.error(error);

      messageBox.innerHTML =
        "❌ Something went wrong. Please try again.";
      messageBox.className = "form-message error";

    }

    // Restore button
    submitBtn.disabled = false;
    submitBtn.innerHTML =
      `<i class="fa-solid fa-calculator"></i> Get My Quote`;

  });

}