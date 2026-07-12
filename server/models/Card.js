const mongoose = require("mongoose");

const generateCardNumber = () => {
    // Generates a 16-digit card number in groups of 4
    const groups = Array.from({ length: 4 }, () =>
        Math.floor(1000 + Math.random() * 9000).toString()
    );
    return groups.join("");
};

const generateCVV = () =>
    Math.floor(100 + Math.random() * 900).toString();

const generateExpiry = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 5);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year  = String(date.getFullYear()).slice(-2);
    return `${month}/${year}`;
};

const cardSchema = new mongoose.Schema(
    {
        accountNumber: {
            type:     String,
            required: true,
            unique:   true,
        },

        cardHolderName: {
            type:     String,
            required: true,
        },

        cardNumber: {
            type:     String,
            unique:   true,
            default:  generateCardNumber,
        },

        cvv: {
            type:    String,
            default: generateCVV,
        },

        expiryDate: {
            type:    String,
            default: generateExpiry,
        },

        cardType: {
            type:    String,
            enum:    ["Visa", "Mastercard", "Rupay"],
            default: "Rupay",
        },

        isActive: {
            type:    Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Card", cardSchema);