const express = require("express");

const router = express.Router();

const {
    addCard,
} = require("../controllers/cardController");

router.post("/add-card", addCard);

module.exports = router;