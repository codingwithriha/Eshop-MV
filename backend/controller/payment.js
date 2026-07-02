const express = require("express");
const router = express.Router();
const catchAsyncError = require("../middleware/catchAsyncErrors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
router.post(
  "/process",
  catchAsyncError(async (req, res, next) => {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: "usd",
      metadata: {
        company: "Ecommerce",
      },
    });

    res.status(200).json({
      success: true,
      client_secret: paymentIntent.client_secret,
    });
  })
);
router.get(
  "/stripe-api-key",
  catchAsyncError(async (req, res, next) => {
    res.status(200).json({ stripeapikey: process.env.STRIPE_API_KEY });
  })
);
module.exports = router;
