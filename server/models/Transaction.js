const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        paymentMethod: {
            type: String,
            enum: ["ACCOUNT", "CARD"],
            required: true,
        },

        senderAccountNumber: {
            type: String,
            required: true,
        },

        senderCardNumber: {
            type: String,
            default: null,
        },

        receiverType: {
            type: String,
            enum: ["ACCOUNT", "CARD"],
            default: "ACCOUNT",
        },

        receiverAccountNumber: {
            type: String,
            required: true,
        },

        receiverCardNumber: {
            type: String,
            default: null,
        },

        amount: {
            type: Number,
            required: true,
        },

        transactionType: {
            type: String,
            enum: [
                "Transfer",
                "Online Payment",
                "Card Payment",
            ],
            default: "Transfer",
        },

        pinVerified: {
            type: Boolean,
            default: false,
        },

        otpVerified: {
            type: Boolean,
            default: false,
        },

        status: {
            type: String,
            enum: [
                "Success",
                "Failed",
                "Pending",
            ],
            default: "Success",
        },

        remarks: {
            type: String,
            default: "",
        },

        referenceNumber: {
            type: String,
            unique: true,
            default: () =>
                "TXN" +
                Date.now() +
                Math.floor(Math.random() * 1000),
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Transaction",
    transactionSchema
);