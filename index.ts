import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { initializeApp } from "firebase-admin/app";
import * as nodemailer from "nodemailer";

initializeApp();

/* ================================================================
   SETUP — Gmail transporter
   Before deploying, set your secrets:
     firebase functions:secrets:set GMAIL_USER
     firebase functions:secrets:set GMAIL_PASS
   Use a Gmail App Password (not your real password):
   https://myaccount.google.com/apppasswords
================================================================ */

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
}

/* ================================================================
   TRIGGER — fires when a new document is created in /quotes/{id}
================================================================ */
export const onNewQuote = onDocumentCreated(
  {
    document: "quotes/{quoteId}",
    secrets: ["GMAIL_USER", "GMAIL_PASS"],
  },
  async (event) => {
    const data = event.data?.data();
    if (!data) return;

    const quoteId = event.params.quoteId;
    const adminEmail = process.env.GMAIL_USER as string;

    const {
      fullName = "Customer",
      email: customerEmail = "",
      phone = "—",
      shipmentType = "—",
      pickupLocation = "—",
      deliveryLocation = "—",
      cargo = "—",
      packingResponsibility = "—",
      materialsNeeded = "—",
      furnitureDisassembly = "—",
      fragileItems = "—",
      floorLevels = "—",
      elevator = "—",
      parking = "—",
      walkingDistance = "—",
      tightSpaces = "—",
      supervisorPresent = "—",
      extraHelp = "—",
      appliancesHelp = "—",
      boxesCount = "—",
      bulkyItems = "—",
      timing = "—",
      storageNeeded = "—",
    } = data;

    const transporter = createTransporter();

    /* ----------------------------------------------------------
       1. ADMIN ALERT EMAIL
    ---------------------------------------------------------- */
    const adminMail = {
      from: `"Imani Gift Logistics" <${adminEmail}>`,
      to: adminEmail,
      subject: `🚚 New Quote Request from ${fullName}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">

          <div style="background:#1a3c5e;padding:24px 32px;">
            <h1 style="color:#fff;margin:0;font-size:22px;">New Quote Request</h1>
            <p style="color:#a8c4e0;margin:4px 0 0;">Imani Gift Logistics — Admin Alert</p>
          </div>

          <div style="padding:32px;">

            <h3 style="color:#1a3c5e;border-bottom:2px solid #1a3c5e;padding-bottom:8px;">Customer Details</h3>
            <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
              ${row("Quote ID", quoteId, true)}
              ${row("Full Name", fullName)}
              ${row("Email", customerEmail, true)}
              ${row("Phone", phone)}
              ${row("Service", shipmentType, true)}
              ${row("Route", `${pickupLocation} → ${deliveryLocation}`)}
              ${row("Cargo", cargo, true)}
            </table>

            <h3 style="color:#1a3c5e;border-bottom:2px solid #1a3c5e;padding-bottom:8px;">Logistics Questionnaire</h3>
            <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
              ${row("Packing Responsibility", packingResponsibility, true)}
              ${row("Materials Needed", materialsNeeded)}
              ${row("Furniture Disassembly", furnitureDisassembly, true)}
              ${row("Fragile Items", fragileItems)}
              ${row("Floor Levels", floorLevels, true)}
              ${row("Elevator", elevator)}
              ${row("Parking", parking, true)}
              ${row("Walking Distance >20m", walkingDistance)}
              ${row("Tight Spaces", tightSpaces, true)}
              ${row("Supervisor Present", supervisorPresent)}
              ${row("Extra Help", extraHelp, true)}
              ${row("Appliances Help", appliancesHelp)}
              ${row("Box Count", boxesCount, true)}
              ${row("Bulky Items", bulkyItems)}
              ${row("Timing", timing, true)}
              ${row("Storage Needed", storageNeeded)}
            </table>

            <a href="https://imanigifts-logistics.web.app/review-quotes.html?id=${quoteId}"
               style="display:inline-block;background:#1a3c5e;color:#fff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;">
              Review &amp; Respond to Quote →
            </a>

          </div>

          <div style="background:#f5f5f5;padding:16px 32px;font-size:12px;color:#999;text-align:center;">
            Imani Gift Logistics · Admin Notification System
          </div>
        </div>
      `,
    };

    /* ----------------------------------------------------------
       2. CUSTOMER CONFIRMATION EMAIL
    ---------------------------------------------------------- */
    const customerMail = {
      from: `"Imani Gift Logistics" <${adminEmail}>`,
      to: customerEmail,
      subject: "✅ Your Quote Request Has Been Received — Imani Gift Logistics",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">

          <div style="background:#1a3c5e;padding:24px 32px;">
            <h1 style="color:#fff;margin:0;font-size:22px;">Quote Request Received!</h1>
            <p style="color:#a8c4e0;margin:4px 0 0;">Imani Gift Logistics</p>
          </div>

          <div style="padding:32px;">
            <p style="font-size:16px;color:#333;">Hi <strong>${fullName}</strong>,</p>
            <p style="color:#555;line-height:1.7;">
              Thank you for reaching out to <strong>Imani Gift Logistics</strong>. We've received your
              quote request and our team will review it shortly. You can expect a response within
              <strong>24–48 hours</strong>.
            </p>

            <div style="background:#f5f8ff;border-left:4px solid #1a3c5e;padding:16px 20px;border-radius:4px;margin:24px 0;">
              <p style="margin:0;font-weight:bold;color:#1a3c5e;">Your Request Summary</p>
              <p style="margin:8px 0 0;color:#555;line-height:1.8;">
                <strong>Service:</strong> ${shipmentType}<br>
                <strong>Route:</strong> ${pickupLocation} → ${deliveryLocation}<br>
                <strong>Reference ID:</strong> <code>${quoteId}</code>
              </p>
            </div>

            <p style="color:#555;line-height:1.7;">
              If you have any urgent questions, please contact us and quote your reference ID above.
            </p>

            <p style="color:#333;margin-top:32px;">
              Warm regards,<br>
              <strong>The Imani Gift Logistics Team</strong>
            </p>
          </div>

          <div style="background:#f5f5f5;padding:16px 32px;font-size:12px;color:#999;text-align:center;">
            © Imani Gift Logistics · You are receiving this because you submitted a quote request.
          </div>
        </div>
      `,
    };

    /* ----------------------------------------------------------
       3. SEND
    ---------------------------------------------------------- */
    try {
      await transporter.sendMail(adminMail);
      console.log(`✅ Admin alert sent for quote ${quoteId}`);

      if (customerEmail) {
        await transporter.sendMail(customerMail);
        console.log(`✅ Customer confirmation sent to ${customerEmail}`);
      }
    } catch (err) {
      console.error("❌ Email send failed:", err);
    }
  }
);

/* ================================================================
   HELPER — alternating table row
================================================================ */
function row(label: string, value: string, shaded = false): string {
  const bg = shaded ? "background:#f5f8ff;" : "";
  return `
    <tr style="${bg}">
      <td style="padding:9px 14px;font-weight:bold;width:40%;border-bottom:1px solid #e0e0e0;">${label}</td>
      <td style="padding:9px 14px;border-bottom:1px solid #e0e0e0;">${value}</td>
    </tr>`;
}
