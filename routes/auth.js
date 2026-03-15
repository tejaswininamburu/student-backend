const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Student = require("../models/Student");
const { protect } = require("../middleware/auth");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../config/email");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @route   POST /api/auth/register
// @desc    Register a new student
// @access  Public
router.post("/register", async (req, res) => {
  try {
    const {
      regNo,
      name,
      email,
      password,
      branch,
      program,
      year,
      section,
      admissionCategory,
    } = req.body;

    // Check if student already exists
    const studentExists = await Student.findOne({
      $or: [{ email }, { regNo }],
    });

    if (studentExists) {
      return res.status(400).json({
        message: "Student with this email or registration number already exists",
      });
    }

    // Hash password directly here
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new student with hashed password
    const student = await Student.create({
      regNo,
      name,
      email,
      password: hashedPassword,
      branch,
      program: program || "B.Tech",
      year: Number(year) || 1,
      section: section || "A",
      admissionCategory: admissionCategory || "EAMCET",
    });

    if (student) {
      res.status(201).json({
        _id: student._id,
        regNo: student.regNo,
        name: student.name,
        email: student.email,
        branch: student.branch,
        role: student.role,
        token: generateToken(student._id),
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Login student
// @access  Public
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find student by email
    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare password directly here
    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: student._id,
      regNo: student.regNo,
      name: student.name,
      email: student.email,
      branch: student.branch,
      role: student.role,
      token: generateToken(student._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/admin/login
// @desc    Admin login
// @access  Public
router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Student.findOne({ email, role: "admin" });

    if (!admin) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    // Compare password directly here
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    res.json({
      _id: admin._id,
      regNo: admin.regNo,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in student
// @access  Private
router.get("/me", protect, async (req, res) => {
  try {
    const student = await Student.findById(req.student._id).select("-password");
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const student = await Student.findOne({ email });

    if (!student) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token and save to database
    student.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Token expires in 15 minutes
    student.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await student.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

    // Send email
    await sendPasswordResetEmail(student.email, student.name, resetUrl);

    res.json({ message: "Password reset email sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/auth/reset-password/:token
// @desc    Reset password using token
// @access  Public
router.put("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Hash the token from URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    // Find student with valid token
    const student = await Student.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!student) {
      return res.status(400).json({ message: "Invalid or expired reset token. Please request a new one." });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(password, salt);

    // Clear reset token fields
    student.resetPasswordToken = "";
    student.resetPasswordExpire = null;

    await student.save({ validateBeforeSave: false });

    res.json({ message: "Password reset successfully! You can now login." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;