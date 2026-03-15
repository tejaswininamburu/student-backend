const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const { protect, adminOnly } = require("../middleware/auth");
const { uploadPhoto, cloudinary } = require("../config/cloudinary");

// @route   GET /api/students
// @desc    Get all students (Admin only)
// @access  Private/Admin
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const students = await Student.find({ role: "student" }).select("-password");
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/students/:regNo
// @desc    Get student by registration number
// @access  Private
router.get("/:regNo", protect, async (req, res) => {
  try {
    const student = await Student.findOne({
      regNo: req.params.regNo.toUpperCase(),
    }).select("-password");

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/students/profile
// @desc    Update student profile
// @access  Private
router.put("/profile", protect, async (req, res) => {
  try {
    const student = await Student.findById(req.student._id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update fields
    student.name = req.body.name || student.name;
    student.phone = req.body.phone || student.phone;
    student.dob = req.body.dob || student.dob;
    student.gender = req.body.gender || student.gender;
    student.blood = req.body.blood || student.blood;
    student.address = req.body.address || student.address;
    student.cgpa = req.body.cgpa || student.cgpa;
    student.section = req.body.section || student.section;
    student.year = req.body.year || student.year;

    // Update password if provided
    if (req.body.password) {
      student.password = req.body.password;
    }

    const updatedStudent = await student.save();

    res.json({
      _id: updatedStudent._id,
      regNo: updatedStudent.regNo,
      name: updatedStudent.name,
      email: updatedStudent.email,
      phone: updatedStudent.phone,
      dob: updatedStudent.dob,
      gender: updatedStudent.gender,
      blood: updatedStudent.blood,
      address: updatedStudent.address,
      branch: updatedStudent.branch,
      year: updatedStudent.year,
      section: updatedStudent.section,
      cgpa: updatedStudent.cgpa,
      role: updatedStudent.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/students/:id
// @desc    Delete student (Admin only)
// @access  Private/Admin
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    await student.deleteOne();
    res.json({ message: "Student removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/students/:id/role
// @desc    Update student role (Admin only)
// @access  Private/Admin
router.put("/:id/role", protect, adminOnly, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    student.role = req.body.role || student.role;
    await student.save();

    res.json({ message: "Student role updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/students/photo
// @desc    Upload profile photo
// @access  Private
router.post("/photo", protect, uploadPhoto.single("photo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a photo" });
    }

    const student = await Student.findById(req.student._id);

    // Delete old photo from Cloudinary if exists
    if (student.photo && student.photo.includes("cloudinary")) {
      const publicId = student.photo.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`student-photos/${publicId}`);
    }

    // Update photo URL
    student.photo = req.file.path;
    await student.save();

    res.json({
      message: "Photo updated successfully",
      photo: req.file.path,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;