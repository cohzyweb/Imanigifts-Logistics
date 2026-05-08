const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const Quote = require("../models/Quote");
const { adminTemplate, customerTemplate } = require("../templates/emailTemplates");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// CREATE QUOTE
router.post("/", async (req, res) => {
  try {
    const quote = new Quote(req.body);
    await quote.save();

    // Email Admin
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "New Quote Request",
      html: adminTemplate(req.body)
    });

    // Email Customer
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: req.body.email,
      subject: "Quote Received - Imani Logistics",
      html: customerTemplate(req.body)
    });

    res.status(200).json({ message: "Quote submitted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET ALL QUOTES (for admin dashboard)
router.get("/", async (req, res) => {
  const quotes = await Quote.find().sort({ createdAt: -1 });
  res.json(quotes);
});

module.exports = router;