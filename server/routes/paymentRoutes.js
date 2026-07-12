const express = require("express");

const router = express.Router();

const {
    makePayment,
    cardPayment,
} = require("../controllers/paymentController");

const authMiddleware = require(
    "../middleware/authMiddleware"
);

// Account Transfer
router.post(
    "/make-payment",
    authMiddleware,
    makePayment
);

// Card Payment
router.post(
    "/card-payment",
    authMiddleware,
    cardPayment
);

module.exports = router;