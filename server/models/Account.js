const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    accountNumber: {
      type: String,
      unique: true,
    },

    accountHolderName: {
      type: String,
      required: true,
    },

    registeredMobileNumber: {
      type: String,
      unique: true,
      required: true,
    },

    accountType: {
      type: String,
      default: "Savings",
    },

    balance: {
      type: Number,
      default: 0,
    },

    role: {
      type: String,
      default: "USER",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Account", accountSchema);