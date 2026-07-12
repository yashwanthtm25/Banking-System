const express = require("express");
const router  = express.Router();

const authMiddleware            = require("../middleware/authMiddleware");
const { generatePin, resetPin } = require("../controllers/pinController");

// POST /api/pin/generate  — first-time PIN setup (protected)
router.post("/generate", authMiddleware, generatePin);

// PUT  /api/pin/reset     — reset existing PIN (protected)
router.put("/reset",    authMiddleware, resetPin);

module.exports = router;