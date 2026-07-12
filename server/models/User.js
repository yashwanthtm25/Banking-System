const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        mobileNumber: {
            type:     String,
            required: true,
            unique:   true,
        },

        password: {
            type:     String,
            required: true,
        },

        mobileVerified: {
            type:    Boolean,
            default: false,
        },

        transactionPin: {
            type:    String,
            default: null,      // null until user sets it for first time
        },

        pinSet: {
            type:    Boolean,
            default: false,     // false = first-time setup required
        },

        accountNumber: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);