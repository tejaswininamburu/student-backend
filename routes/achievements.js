const express = require("express");
const router = express.Router();
const Achievement = require("../models/Achievement");
const { protect, adminOnly } = require("../middleware/auth");
const { uploadDocument } = require("../config/cloudinary");
const { sendAchievementRejectionEmail, sendAchievementVerificationEmail } = require("../config/email");

// @route   POST /api/achievements
// @desc    Add new achievement with certificate (Student)
// @access  Private
router.post("/", protect, uploadDocument.single("certificate"), async (req, res) => {
  try {
    const { title, type, description, prize, year, semester } = req.body;

    let certificateUrl = "";
    let certificateType = "";

    if (req.file) {
      certificateUrl = req.file.path;
      certificateType = req.file.mimetype === "application/pdf" ? "pdf" : "image";
    }

    const achievement = await Achievement.create({
      student: req.student._id,
      regNo: req.student.regNo,
      title,
      type,
      description,
      prize,
      year,
      semester,
      certificate: certificateUrl,
      certificateType,
      status: "Pending",
    });

    res.status(201).json(achievement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/achievements/my
// @desc    Get my achievements (Student)
// @access  Private
router.get("/my", protect, async (req, res) => {
  try {
    const achievements = await Achievement.find({
      student: req.student._id,
    }).sort({ createdAt: -1 });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/achievements/all
// @desc    Get all achievements (Admin)
// @access  Private/Admin
router.get("/all", protect, adminOnly, async (req, res) => {
  try {
    const achievements = await Achievement.find()
      .populate("student", "name regNo branch")
      .sort({ createdAt: -1 });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/achievements/pending
// @desc    Get all pending achievements (Admin)
// @access  Private/Admin
router.get("/pending", protect, adminOnly, async (req, res) => {
  try {
    const achievements = await Achievement.find({ status: "Pending" })
      .populate("student", "name regNo branch")
      .sort({ createdAt: -1 });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/achievements/:regNo
// @desc    Get achievements by registration number
// @access  Private
router.get("/:regNo", protect, async (req, res) => {
  try {
    const achievements = await Achievement.find({
      regNo: req.params.regNo.toUpperCase(),
    }).sort({ createdAt: -1 });
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/achievements/:id
// @desc    Update achievement (Student)
// @access  Private
router.put("/:id", protect, uploadDocument.single("certificate"), async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    if (achievement.student.toString() !== req.student._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (achievement.status === "Verified") {
      return res.status(400).json({ message: "Cannot edit a verified achievement" });
    }

    achievement.title = req.body.title || achievement.title;
    achievement.type = req.body.type || achievement.type;
    achievement.description = req.body.description || achievement.description;
    achievement.prize = req.body.prize || achievement.prize;
    achievement.year = req.body.year || achievement.year;
    achievement.semester = req.body.semester || achievement.semester;
    achievement.status = "Pending";

    if (req.file) {
      achievement.certificate = req.file.path;
      achievement.certificateType = req.file.mimetype === "application/pdf" ? "pdf" : "image";
    }

    const updated = await achievement.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/achievements/:id/verify
// @desc    Verify or reject achievement (Admin)
// @access  Private/Admin
router.put("/:id/verify", protect, adminOnly, async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id)
      .populate("student", "name email");

    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    achievement.status = req.body.status;
    achievement.adminComment = req.body.adminComment || "";

    const updated = await achievement.save();

    // Send email to student
    if (req.body.status === "Rejected") {
      await sendAchievementRejectionEmail(
        achievement.student.email,
        achievement.student.name,
        achievement.title,
        req.body.adminComment
      );
    } else if (req.body.status === "Verified") {
      await sendAchievementVerificationEmail(
        achievement.student.email,
        achievement.student.name,
        achievement.title
      );
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/achievements/:id
// @desc    Delete achievement (Student or Admin)
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({ message: "Achievement not found" });
    }

    if (
      achievement.student.toString() !== req.student._id.toString() &&
      req.student.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await achievement.deleteOne();
    res.json({ message: "Achievement removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;