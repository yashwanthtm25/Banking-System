const express = require("express");

const router = express.Router();

const User = require("../models/User");

router.put("/update-account", async (req, res) => {

    try {

        const { mobileNumber, accountNumber } = req.body;

        const user = await User.findOneAndUpdate(
            { mobileNumber },
            { accountNumber },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.status(200).json({
            message: "Account linked successfully",
            user,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message,
        });
    }
});

module.exports = router;