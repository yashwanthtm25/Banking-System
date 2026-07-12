const Account = require("../models/Account");
const User = require("../models/User");

// =========================
// CREATE ACCOUNT
// =========================
const createAccount = async (req, res) => {
    try {

        const {
            mobileNumber,
            accountHolderName,
            balance,
            accountType,
        } = req.body;

        // Check existing account
        const existingAccount = await Account.findOne({
            registeredMobileNumber: mobileNumber,
        });

        if (existingAccount) {
            return res.status(400).json({
                message: "Account already exists",
            });
        }

        // Get last account
        const lastAccount = await Account
            .findOne()
            .sort({ accountNumber: -1 });

        let newAccountNumber = "10001";

        if (lastAccount) {
            newAccountNumber = (
                Number(lastAccount.accountNumber) + 1
            ).toString();
        }

        // Create account
        const account = await Account.create({
            accountNumber: newAccountNumber,
            accountHolderName,
            registeredMobileNumber: mobileNumber,
            accountType: accountType || "Savings",
            balance: balance || 10000,
        });

        // Update user account number also
        await User.findOneAndUpdate(
            { mobileNumber },
            {
                accountNumber: newAccountNumber,
            }
        );

        res.status(201).json({
            message: "Account created successfully",
            account,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message,
        });
    }
};

// =========================
// GET ACCOUNT DETAILS
// =========================
const getAccountDetails = async (req, res) => {
    try {

        const { accountNumber } = req.params;

        const account = await Account.findOne({
            accountNumber,
        });

        if (!account) {
            return res.status(404).json({
                message: "Account not found",
            });
        }

        res.status(200).json(account);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};

// =========================
// GET ACCOUNT USING TOKEN
// =========================
const getMyAccount = async (req, res) => {
    try {

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const account = await Account.findOne({
            accountNumber: user.accountNumber,
        });

        if (!account) {
            return res.status(404).json({
                message: "Account not found",
            });
        }

        res.status(200).json(account);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};

// =========================
// UPDATE ACCOUNT
// =========================
const updateAccount = async (req, res) => {
    try {

        const { accountNumber } = req.params;

        const updatedAccount =
            await Account.findOneAndUpdate(
                { accountNumber },
                req.body,
                { new: true }
            );

        if (!updatedAccount) {
            return res.status(404).json({
                message: "Account not found",
            });
        }

        res.status(200).json({
            message: "Account updated successfully",
            account: updatedAccount,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};

// =========================
// DELETE ACCOUNT
// =========================
const deleteAccount = async (req, res) => {
    try {

        const { accountNumber } = req.params;

        const deletedAccount =
            await Account.findOneAndDelete({
                accountNumber,
            });

        if (!deletedAccount) {
            return res.status(404).json({
                message: "Account not found",
            });
        }

        res.status(200).json({
            message: "Account deleted successfully",
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    createAccount,
    getAccountDetails,
    getMyAccount,
    updateAccount,
    deleteAccount,
};