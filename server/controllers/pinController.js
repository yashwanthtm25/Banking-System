const User = require("../models/User");

// =========================
// GENERATE PIN (first time only)
// POST /api/pin/generate
// Protected: authMiddleware
// =========================
const generatePin = async (req, res) => {
    try {
        const { newPin, confirmPin } = req.body;

        if (!newPin || !confirmPin) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!/^\d{4}$/.test(newPin)) {
            return res.status(400).json({ message: "PIN must be exactly 4 digits" });
        }

        if (newPin !== confirmPin) {
            return res.status(400).json({ message: "PINs do not match" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Block if PIN already set
        if (user.pinSet) {
            return res.status(400).json({
                message: "PIN already set. Use Reset PIN to change it.",
            });
        }

        user.transactionPin = newPin;
        user.pinSet         = true;
        await user.save();

        res.status(200).json({ message: "Transaction PIN set successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// =========================
// RESET PIN
// PUT /api/pin/reset
// Protected: authMiddleware
// =========================
const resetPin = async (req, res) => {
    try {
        const { currentPin, newPin, confirmPin } = req.body;

        if (!currentPin || !newPin || !confirmPin) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!/^\d{4}$/.test(newPin)) {
            return res.status(400).json({ message: "PIN must be exactly 4 digits" });
        }

        if (newPin !== confirmPin) {
            return res.status(400).json({ message: "New PIN and confirm PIN do not match" });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Must have set PIN first
        if (!user.pinSet) {
            return res.status(400).json({
                message: "No PIN set yet. Please generate your PIN first.",
            });
        }

        if (user.transactionPin !== currentPin) {
            return res.status(400).json({ message: "Current PIN is incorrect" });
        }

        if (newPin === currentPin) {
            return res.status(400).json({ message: "New PIN must be different from current PIN" });
        }

        user.transactionPin = newPin;
        await user.save();

        res.status(200).json({ message: "Transaction PIN updated successfully" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { generatePin, resetPin };