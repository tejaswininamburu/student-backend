const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for documents
const documentStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "student-documents",
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
    resource_type: "auto",
  },
});

// Storage for profile photos
const photoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "student-photos",
    allowed_formats: ["jpg", "jpeg", "png"],
    resource_type: "image",
    transformation: [{ width: 400, height: 400, crop: "fill" }],
  },
});

// File size limit — 5MB
const limits = { fileSize: 5 * 1024 * 1024 };

// File type filter
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG and PDF files are allowed!"), false);
  }
};

const uploadDocument = multer({
  storage: documentStorage,
  limits,
  fileFilter,
});

const uploadPhoto = multer({
  storage: photoStorage,
  limits,
  fileFilter,
});

module.exports = { cloudinary, uploadDocument, uploadPhoto };