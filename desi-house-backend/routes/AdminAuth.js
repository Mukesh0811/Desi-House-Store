const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const adminAuth = require("../middlewares/adminAuth");
const adminRole = require("../middlewares/adminRole");
const nodemailer = require("nodemailer");

// =======================
// REGISTER ADMIN
// =======================
router.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ message: "Admin already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const admin = new Admin({
      email,
      password: hashed,
      role: role || "admin",
    });

    await admin.save();
    res.json({ message: "Admin registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// LOGIN ADMIN
// =======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ admin, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =======================
// 🔐 ADMIN FORGOT PASSWORD (SEND OTP)
// =======================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP

    admin.resetOtp = otp;
    admin.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await admin.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "DESI HOUSE Admin Password Reset OTP",
      html: `
        <h2>Admin Password Reset</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    });

    res.json({ message: "OTP sent to admin email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});


// =======================
// 🔁 ADMIN RESET PASSWORD USING OTP
// =======================
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const admin = await Admin.findOne({
      email,
      resetOtp: otp,
      resetOtpExpiry: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    admin.password = hashed;
    admin.resetOtp = undefined;
    admin.resetOtpExpiry = undefined;

    await admin.save();

    res.json({ message: "Admin password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to reset password" });
  }
});


// =======================
// CREATE NEW ADMIN (ONLY SUPERADMIN)
// =======================
router.post("/create", adminAuth, adminRole("superadmin"), async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: "Admin already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      email,
      password: hashed,
      role: role || "admin",
    });

    await newAdmin.save();
    res.json({ message: "New admin created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// GET ALL ADMINS (ONLY SUPERADMIN)
// =======================
router.get("/all", adminAuth, adminRole("superadmin"), async (req, res) => {
  try {
    const admins = await Admin.find().select("-password");
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// DELETE ADMIN (ONLY SUPERADMIN)
// =======================
router.delete("/delete/:id", adminAuth, adminRole("superadmin"), async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    await admin.deleteOne();
    res.json({ message: "Admin deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// UPDATE ADMIN ROLE
// =======================
router.put("/update-role/:id", adminAuth, adminRole("superadmin"), async (req, res) => {
  try {
    const { role } = req.body;
    await Admin.findByIdAndUpdate(req.params.id, { role });
    res.json({ message: "Role updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
