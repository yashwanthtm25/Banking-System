const express = require("express");

const router = express.Router();

const {
    createAccount,
    getAccountDetails,
    getMyAccount,
    updateAccount,
    deleteAccount,
} = require("../controllers/accountController");

const authMiddleware = require("../middleware/authMiddleware");

// CREATE ACCOUNT
router.post("/create", createAccount);

// GET LOGGED IN USER ACCOUNT
router.get("/me", authMiddleware, getMyAccount);

// GET ACCOUNT DETAILS
router.get("/:accountNumber", getAccountDetails);

// UPDATE ACCOUNT
router.put("/:accountNumber", updateAccount);

// DELETE ACCOUNT
router.delete("/:accountNumber", deleteAccount);

module.exports = router;