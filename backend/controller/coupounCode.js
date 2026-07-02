const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const Shop = require("../model/shop");
const fs = require("fs");
const CouponCode = require("../model/coupounCode");
const { isSeller } = require("../middleware/auth");
router.post(
  "/create-coupun-code",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const isCoupounCodeExist = await CouponCode.find({
        name: req.body.name,
      });
      if (isCoupounCodeExist.length !== 0) {
        return next(new ErrorHandler("Coupoun code already exists", 400));
      }
      const coupounCode = await CouponCode.create(req.body);
      res.status(201).json({
        success: true,
        coupounCode,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);
router.get(
  "/get-coupon/:id",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    //this is returning an array of coupoun codes
    const couponCode = await CouponCode.find({ shopId: req.body.id });
    res.status(201).json({
      success: true,
      couponCode,
    });
  })
);
router.delete(
  "/delete-coupon/:id",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const couponCode = await CouponCode.findByIdAndDelete(req.params.id);

      if (!couponCode) {
        return next(new ErrorHandler("Coupon code dosen't exists!", 400));
      }
      res.status(201).json({
        success: true,
        message: "Coupon code deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);
//get  couponCode Value based on name
router.get(
  "/get-coupon-value/:name",
  catchAsyncError(async (req, res, next) => {
    try {
      const couponCode = await CouponCode.findOne({ name: req.params.name });

      res.status(200).json({
        success: true,
        couponCode,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);

module.exports = router;
