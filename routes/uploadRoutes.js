const express = require("express");
const router = express.Router();
const { upload, uploadProfileImage } = require("../controllers/uploadController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/profile-image", verifyToken, upload.single("image"), uploadProfileImage);

module.exports = router;
