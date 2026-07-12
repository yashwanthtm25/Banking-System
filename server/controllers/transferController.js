const Account = require("../models/Account");
const Transaction = require("../models/Transaction");

const transferMoney = async (req, res) => {
    try {
        console.log("BODY RECEIVED:", req.body);
        const { toAccountNumber, amount } = req.body;
        const amountNum = Number(amount);

        console.log("USER:", req.user);

        const senderAccount = await Account.findOne({
            registeredMobileNumber: req.user.mobileNumber
        });

        const receiverAccount = await Account.findOne({
            accountNumber: toAccountNumber
        });

        if (!senderAccount) {
            return res.status(404).json({ message: "Sender account not found" });
        }

        if (!receiverAccount) {
            return res.status(404).json({ message: "Receiver account not found" });
        }

        if (senderAccount.balance < amountNum) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        senderAccount.balance -= amountNum;
        receiverAccount.balance += amountNum;

        await senderAccount.save();
        await receiverAccount.save();

        await Transaction.create({
            from: senderAccount.accountNumber,
            to: receiverAccount.accountNumber,
            amount: amountNum,
            type: "TRANSFER",
            paymentMethod: "ACCOUNT"
        });

        return res.json({
            message: "Transfer successful",
            newBalance: senderAccount.balance
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { transferMoney };