const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

const protect = async (req, res, next) => {
  let token;

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.student = await Student.findById(decoded.id).select("-password");

      if (!req.student) {
        return res.status(401).json({ message: "Student not found" });
      }

      next();
    } else {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const adminOnly = (req, res, next) => {
  if (req.student && req.student.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Not authorized, admin only" });
  }
};

module.exports = { protect, adminOnly };