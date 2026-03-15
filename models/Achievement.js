const mongoose = require("mongoose");

const AchievementSchema = new mongoose.Schema({
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
  title: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: [
      "Hackathon",
      "Internship",
      "Research Publication",
      "Technical Competition",
      "Cultural Achievement",
      "Sports Achievement",
      "Workshop & Seminar",
    ],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  prize: {
    type: String,
    default: "",
  },
  year: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  certificate: {
    type: String,
    default: "",
  },
  certificateType: {
    type: String,
    default: "",
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

module.exports = mongoose.model("Achievement", AchievementSchema);