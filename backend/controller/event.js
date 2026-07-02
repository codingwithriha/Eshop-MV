const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const { upload } = require("../multer");
const Shop = require("../model/shop");
const Event = require("../model/event");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const { isSeller, isAthuenticated, isAdmin } = require("../middleware/auth");
router.post(
  "/create-event",
  catchAsyncError(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Dose`nt Exist!", 404));
      } else {
        let images = [];
        if (typeof req.body.images === "string") {
          images.push(req.body.images);
        } else {
          images = req.body.images;
        }
        const imagesLinks = [];
        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.uploader.upload(images[i], {
            folder: "products",
          });
          imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
        const productData = req.body;
        productData.images = imagesLinks;
        productData.shop = shop;
        const event = await Event.create(productData);
        res.status(201).json({
          success: true,
          event,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);
//get all shop events
router.get(
  "/get-all-events/:id",
  catchAsyncError(async (req, res, next) => {
    const events = await Event.find({ shopId: req.params.id });
    res.status(200).json({
      success: true,
      events,
    });
  })
);

//delete event of a shop
router.delete(
  "/delete-shop-event/:id",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const event = await Event.findById(req.params.id);

      if (!event) {
        return next(new ErrorHandler("Event is not found with this id", 404));
      }

      for (let i = 0; i < event.images.length; i++) {
        const result = await cloudinary.uploader.destroy(
          event.images[i].public_id
        );
      }
      await event.deleteOne();
      res.status(201).json({
        success: true,
        message: "Event Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);
//get all events
router.get(
  "/get-all-events",
  catchAsyncError(async (req, res, next) => {
    try {
      const events = await Event.find();
      res.status(201).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);
//get all Events ---- (Admin)
router.get(
  "/admin-all-events",
  isAthuenticated,
  isAdmin("Admin"),
  catchAsyncError(async (req, res, next) => {
    try {
      const events = await Event.find().sort({
        createdAt: -1,
      });
      res.status(200).json({
        success: true,
        events,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
module.exports = router;
