const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  regNo: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  phone: { type: String, default: "" },
  dob: { type: String, default: "" },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    default: "Male",
  },
  blood: { type: String, default: "" },
  address: { type: String, default: "" },
  admissionCategory: {
    type: String,
    enum: ["EAMCET", "VSAT", "JEE", "Management", "Other"],
    default: "EAMCET",
  },
  branch: { type: String, required: true },
  program: { type: String, default: "B.Tech" },
  year: { type: Number, default: 1 },
  section: { type: String, default: "A" },
  cgpa: { type: Number, default: 0 },
  photo: { type: String, default: "" },
  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student",
  },
  resetPasswordToken: {
    type: String,
    default: "",
  },
resetPasswordExpire: {
    type: Date,
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model("Student", StudentSchema);