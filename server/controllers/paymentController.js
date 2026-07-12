const Transaction = require("../models/Transaction");
const Account = require("../models/Account");
const User = require("../models/User");
const Card = require("../models/Card");

// ================= ACCOUNT PAYMENT =================

const makePayment = async (req, res) => {

    try {

        console.log("BODY RECEIVED:", req.body);
        console.log("USER:", req.user);

        const {
            toAccountNumber,
            amount,
            pin,
        } = req.body;

        const paymentAmount = Number(amount);

        // Validate amount
        if (paymentAmount <= 0) {
            return res.status(400).json({
                message: "Invalid amount",
            });
        }

        // Logged-in user
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Verify Transaction PIN
        if (user.transactionPin !== pin) {
            return res.status(400).json({
                message: "Invalid Transaction PIN",
            });
        }

        // Sender account from logged-in user
        const sender = await Account.findOne({
            accountNumber: user.accountNumber,
        });

        if (!sender) {
            return res.status(404).json({
                message: "Sender account not found",
            });
        }

        // Receiver account
        const receiver = await Account.findOne({
            accountNumber: toAccountNumber,
        });

        if (!receiver) {
            return res.status(404).json({
                message: "Receiver account not found",
            });
        }

        // Prevent self transfer
        if (sender.accountNumber === toAccountNumber) {
            return res.status(400).json({
                message: "Cannot transfer to same account",
            });
        }

        // Check balance
        if (sender.balance < paymentAmount) {
            return res.status(400).json({
                message: "Insufficient balance",
            });
        }

        // Deduct amount
        sender.balance -= paymentAmount;

        // Add amount
        receiver.balance += paymentAmount;

        // Save balances
        await sender.save();
        await receiver.save();

        // Save transaction
        const transaction = await Transaction.create({
            paymentMethod: "ACCOUNT",
            senderAccountNumber: sender.accountNumber,
            receiverAccountNumber: receiver.accountNumber,
            amount: paymentAmount,
            transactionType: "Transfer",
            pinVerified: true,
            otpVerified: false,
            status: "Success",
        });

        res.status(201).json({
            message: "Transaction Successful",
            transaction,
            senderBalance: sender.balance,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message,
        });
    }
};

// ================= CARD PAYMENT =================

const cardPayment = async (req, res) => {

    try {

        const {
            cardNumber,
            expiryDate,
            cvv,
            pin,
            receiverAccountNumber,
            amount,
        } = req.body;

        const paymentAmount = Number(amount);

        // Validate amount
        if (paymentAmount <= 0) {
            return res.status(400).json({
                message: "Invalid amount",
            });
        }

        // Find card
        const card = await Card.findOne({
            cardNumber,
        });

        if (!card) {
            return res.status(404).json({
                message: "Card not found",
            });
        }

        // Validate card details
        if (
            card.expiryDate !== expiryDate ||
            card.cvv !== cvv
        ) {
            return res.status(400).json({
                message: "Invalid card details",
            });
        }

        // Find linked sender account
        const sender = await Account.findOne({
            accountNumber: card.linkedAccountNumber,
        });

        if (!sender) {
            return res.status(404).json({
                message: "Linked account not found",
            });
        }

        // Find user linked to account
        const user = await User.findOne({
            accountNumber: sender.accountNumber,
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Verify transaction PIN
        if (user.transactionPin !== pin) {
            return res.status(400).json({
                message: "Invalid Transaction PIN",
            });
        }

        // Receiver account
        const receiver = await Account.findOne({
            accountNumber: receiverAccountNumber,
        });

        if (!receiver) {
            return res.status(404).json({
                message: "Receiver account not found",
            });
        }

        // Prevent self transfer
        if (sender.accountNumber === receiverAccountNumber) {
            return res.status(400).json({
                message: "Cannot transfer to same account",
            });
        }

        // Check balance
        if (sender.balance < paymentAmount) {
            return res.status(400).json({
                message: "Insufficient balance",
            });
        }

        // Deduct amount
        sender.balance -= paymentAmount;

        // Add amount
        receiver.balance += paymentAmount;

        // Save balances
        await sender.save();
        await receiver.save();

        // Save transaction
        const transaction = await Transaction.create({
            paymentMethod: "CARD",
            senderAccountNumber: sender.accountNumber,
            senderCardNumber: cardNumber,
            receiverAccountNumber,
            amount: paymentAmount,
            transactionType: "Online Payment",
            pinVerified: true,
            otpVerified: false,
            status: "Success",
        });

        res.status(201).json({
            message: "Card Payment Successful",
            transaction,
            senderBalance: sender.balance,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    makePayment,
    cardPayment,
};