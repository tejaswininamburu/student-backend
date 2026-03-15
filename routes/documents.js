const express = require("express");
const router = express.Router();
const Document = require("../models/Document");
const Student = require("../models/Student");
const { protect, adminOnly } = require("../middleware/auth");
const { uploadDocument, cloudinary } = require("../config/cloudinary");
const { sendRejectionEmail, sendVerificationEmail } = require("../config/email");

// @route   POST /api/documents/upload
// @desc    Upload a document (Student or Admin)
// @access  Private
router.post("/upload", protect, uploadDocument.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    if (!req.body.type) {
      return res.status(400).json({ message: "Please select document type" });
    }

    // If admin is uploading for a student
    let studentId = req.student._id;
    let studentRegNo = req.student.regNo;

    if (req.student.role === "admin" && req.body.regNo) {
      const student = await Student.findOne({
        regNo: req.body.regNo.toUpperCase(),
      });
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      studentId = student._id;
      studentRegNo = student.regNo;
    }

   // Only replace for single-copy documents
    const singleCopyTypes = [
      "Aadhaar Card",
      "PAN Card",
      "Voter ID",
      "APAAR / ABC ID",
    ];

    if (singleCopyTypes.includes(req.body.type)) {
      const existingDoc = await Document.findOne({
        student: studentId,
        type: req.body.type,
      });
      if (existingDoc) {
        await cloudinary.uploader.destroy(existingDoc.publicId);
        await existingDoc.deleteOne();
      }
    }

    const fileType = req.file.mimetype === "application/pdf" ? "pdf" : "image";

    const document = await Document.create({
      student: studentId,
      regNo: studentRegNo,
      type: req.body.type,
      fileUrl: req.file.path,
      publicId: req.file.filename,
      fileType,
      status: req.student.role === "admin" ? "Verified" : "Pending",
    });

    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/documents/my
// @desc    Get my documents (Student)
// @access  Private
router.get("/my", protect, async (req, res) => {
  try {
    const documents = await Document.find({
      student: req.student._id,
    }).sort({ createdAt: -1 });

    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/documents/all
// @desc    Get all documents (Admin)
// @access  Private/Admin
router.get("/all", protect, adminOnly, async (req, res) => {
  try {
    const documents = await Document.find()
      .populate("student", "name regNo email branch")
      .sort({ createdAt: -1 });

    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/documents/:regNo
// @desc    Get documents by registration number (Admin)
// @access  Private/Admin
router.get("/:regNo", protect, adminOnly, async (req, res) => {
  try {
    const documents = await Document.find({
      regNo: req.params.regNo.toUpperCase(),
    }).sort({ createdAt: -1 });

    res.json(documents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/documents/:id/verify
// @desc    Verify or reject document (Admin)
// @access  Private/Admin
router.put("/:id/verify", protect, adminOnly, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate("student", "name email");

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    document.status = req.body.status;
    document.adminComment = req.body.adminComment || "";

    const updated = await document.save();

    // Send email to student
    if (req.body.status === "Rejected") {
      await sendRejectionEmail(
        document.student.email,
        document.student.name,
        document.type,
        req.body.adminComment
      );
    } else if (req.body.status === "Verified") {
      await sendVerificationEmail(
        document.student.email,
        document.student.name,
        document.type
      );
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/documents/:id
// @desc    Delete document (Student or Admin)
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (
      document.student.toString() !== req.student._id.toString() &&
      req.student.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await cloudinary.uploader.destroy(document.publicId);
    await document.deleteOne();

    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;