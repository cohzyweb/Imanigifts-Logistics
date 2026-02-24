const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");

// 🔐 Secure credentials from Firebase config
const gmailEmail = functions.config().gmail.email;
const gmailPassword = functions.config().gmail.password;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: gmailEmail,
    pass: gmailPassword
  }
});

exports.sendQuoteEmail = functions.firestore
  .document("quotes/{quoteId}")
  .onUpdate(async (change, context) => {

    const before = change.before.data();
    const after = change.after.data();

    // Only continue if status changed
    if (before.status === after.status) return null;
    if (!after.email) return null;

    let subject = `Quote Status Updated: ${after.status}`;
    let message = `
Hello ${after.fullName || "Customer"},

Your quote status has been updated to: ${after.status}
`;

    let attachments = [];

    // If approved → generate PDF invoice
    if (after.status === "Approved") {

      const doc = new PDFDocument();
      const buffers = [];

      doc.on("data", buffers.push.bind(buffers));

      doc.fontSize(20).text("IMANI LOGISTICS INVOICE", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Customer: ${after.fullName || ""}`);
      doc.text(`Email: ${after.email}`);
      doc.text(`Total Price: £${after.total || "0"}`);
      doc.text(`Estimated Delivery: ${after.estimatedTime || ""}`);
      doc.text(`Status: ${after.status}`);

      doc.end();

      const pdfBuffer = await new Promise((resolve) => {
        doc.on("end", () => resolve(Buffer.concat(buffers)));
      });

      attachments.push({
        filename: "Invoice.pdf",
        content: pdfBuffer
      });

      message += "\nAn official invoice is attached to this email.";
    }

    await transporter.sendMail({
      from: `Imani Logistics <${gmailEmail}>`,
      to: after.email,
      subject,
      text: message,
      attachments
    });

    return null;
  });
