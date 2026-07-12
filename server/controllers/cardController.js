const Card = require("../models/Card");

const addCard = async (req, res) => {

    try {

        const card = await Card.create(req.body);

        res.status(201).json({
            message: "Card Added Successfully",
            card,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    addCard,
};