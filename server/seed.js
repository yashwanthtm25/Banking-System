const mongoose = require("mongoose");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const Account = require("./models/Account");

const Card = require("./models/Card");
dotenv.config();

connectDB();

const seedAccounts = async () => {
    try {

        await Account.deleteMany();

        await Account.insertMany([
            {
                accountNumber: "10001",
                accountHolderName: "Yashwanth",
                registeredMobileNumber: "9876543210",
                balance: 10000,
            },

            {
                accountNumber: "10002",
                accountHolderName: "Rahul",
                registeredMobileNumber: "9999999999",
                balance: 5000,
            },
        ]);
        await Card.deleteMany();

await Card.insertMany([
    {
        linkedAccountNumber: "10001",
        cardNumber: "4111111111111111",
        expiryDate: "12/30",
        cvv: "123",
        pin: "4321",
    },
]);
        console.log("Accounts and Cards Seeded");

        process.exit();

    } catch (error) {

        console.log(error);

        process.exit(1);
    }
};

seedAccounts();