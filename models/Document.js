const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  regNo: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  type: {
    type: String,
    enum: [
      "Aadhaar Card",
      "PAN Card",
      "Mark Memo (10th)",
      "Mark Memo (12th)",
      "Mark Memo (Diploma)",
      "Voter ID",
      "APAAR / ABC ID",
      "Transfer Certificate",
      "Migration Certificate",
      "Income Certificate",
      "Caste Certificate",
      "Residence Certificate",
      "Other",
    ],
    required: true,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  fileType: {
    type: String,
    enum: ["image", "pdf"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Verified", "Rejected"],
    default: "Pending",
  },
  adminComment: {
    type: String,
    default: "",
  },
}, { timestamps: true });

module.exports = mongoose.model("Document", DocumentSchema);