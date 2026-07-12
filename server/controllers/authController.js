const User    = require("../models/User");
const Account = require("../models/Account");
const Card    = require("../models/Card");
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");

// =========================
// CHECK MOBILE
// POST /api/auth/check-mobile
// Public — validates mobile exists in Account collection
// =========================
const checkMobile = async (req, res) => {
    try {
        const { mobileNumber } = req.body;

        if (!mobileNumber) {
            return res.status(400).json({ message: "Mobile number is required" });
        }

        const account = await Account.findOne({ registeredMobileNumber: mobileNumber });

        if (!account) {
            return res.status(404).json({ message: "No account found with this mobile number" });
        }

        // Check if user already registered
        const existingUser = await User.findOne({ mobileNumber });
        if (existingUser) {
            return res.status(400).json({ message: "User already registered with this number" });
        }

        res.status(200).json({
            message:            "Account found",
            accountHolderName:  account.accountHolderName,
            accountNumber:      account.accountNumber,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// =========================
// REGISTER
// POST /api/auth/register
// Public
// =========================
const register = async (req, res) => {
    try {
        const { mobileNumber, password, confirmPassword } = req.body;

        if (!mobileNumber || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        // Verify account exists
        const account = await Account.findOne({ registeredMobileNumber: mobileNumber });
        if (!account) {
            return res.status(404).json({ message: "No account found with this mobile number" });
        }

        // Check not already registered
        const existingUser = await User.findOne({ mobileNumber });
        if (existingUser) {
            return res.status(400).json({ message: "User already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const user = await User.create({
            mobileNumber,
            password:       hashedPassword,
            mobileVerified: true,
            transactionPin: null,
            pinSet:         false,
            accountNumber:  account.accountNumber,
        });

        // Auto-generate Card
        const card = await Card.create({
            accountNumber:  account.accountNumber,
            cardHolderName: account.accountHolderName,
        });

        res.status(201).json({
            message: "Registration Successful",
            user: {
                _id:               user._id,
                mobileNumber:      user.mobileNumber,
                accountNumber:     user.accountNumber,
                accountHolderName: account.accountHolderName,
                pinSet:            user.pinSet,
            },
            card: {
                cardNumber: card.cardNumber,
                expiryDate: card.expiryDate,
                cardType:   card.cardType,
            },
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

// =========================
// LOGIN
// POST /api/auth/login
// =========================
const login = async (req, res) => {
    try {
        const { mobileNumber, password } = req.body;

        const user = await User.findOne({ mobileNumber });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Password" });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        const account = await Account.findOne({ accountNumber: user.accountNumber });

        res.status(200).json({
            message: "Login Successful",
            token,
            user: {
                _id:               user._id,
                mobileNumber:      user.mobileNumber,
                accountNumber:     user.accountNumber,
                accountHolderName: account?.accountHolderName || "",
                pinSet:            user.pinSet,
            },
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// =========================
// GET ME
// GET /api/auth/me
// Protected
// =========================
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const account = await Account.findOne({ accountNumber: user.accountNumber });

        res.status(200).json({
            _id:               user._id,
            mobileNumber:      user.mobileNumber,
            accountNumber:     user.accountNumber,
            accountHolderName: account?.accountHolderName || "",
            pinSet:            user.pinSet,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { checkMobile, register, login, getMe };