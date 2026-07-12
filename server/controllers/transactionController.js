const Transaction = require("../models/Transaction");

// GET /transactions/all/:accountNumber
const getTransactions = async (req, res) => {
    try {
        const { accountNumber } = req.params;

        if (!accountNumber) {
            return res.status(400).json({ message: "Account number is required" });
        }

        const transactions = await Transaction.find({
            $or: [
                { senderAccountNumber: accountNumber },
                { receiverAccountNumber: accountNumber },
            ],
        }).sort({ createdAt: -1 });

        res.status(200).json(transactions);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getTransactions };