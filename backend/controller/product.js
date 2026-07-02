const express = require("express");
const router = express.Router();
const Product = require("../model/product");
const Shop = require("../model/shop");
const Order = require("../model/order");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const { upload } = require("../multer");
const cloudinary = require("cloudinary").v2;
const { isSeller, isAthuenticated, isAdmin } = require("../middleware/auth");
router.post(
  "/create-product",
  catchAsyncError(async (req, res, next) => {
    try {
      const shopId = req.body.shopId;
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return next(new ErrorHandler("Shop Id is invalid!", 400));
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

        const product = await Product.create(productData);
        res.status(201).json({
          success: true,
          product,
        });
      }
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);
router.get(
  "/get-all-products-shop/:id",
  catchAsyncError(async (req, res, next) => {
    const products = await Product.find({ shopId: req.params.id });
    res.status(200).json({
      success: true,
      products,
    });
  })
);

// get all products
router.get(
  "/get-all-products",
  catchAsyncError(async (req, res, next) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      res.status(201).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);
// delete product of a shop
router.delete(
  "/delete-shop-product/:id",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const productId = req.params.id;
      const product = await Product.findById(productId);
      if (!product) {
        return next(
          new ErrorHandler("Product is not found with this id!", 404)
        );
      }
      for (let i = 0; i < product.images.length; i++) {
        await cloudinary.uploader.destroy(product.images[i].public_id);
      }
      await product.deleteOne();
      res.status(201).json({
        success: true,
        message: "Product Deleted successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);
//review for a Product
router.put(
  "/create-new-review",
  isAthuenticated,
  catchAsyncError(async (req, res, next) => {
    try {
      const { user, rating, comment, productId, orderId } = req.body;
      const product = await Product.findById(productId);
      const isReviwed = product.reviews.find(
        (rev) => rev.user._id === req.user._id
      );
      const review = {
        user,
        rating,
        comment,
        productId,
      };
      if (isReviwed) {
        product.reviews.forEach((rev) => {
          if (rev.user._id.toString() === req.user._id.toString()) {
            (rev.rating = rating), (rev.comment = comment), (rev.user = user);
          }
        });
      } else {
        product.reviews.push(review);
      }
      let avg = 0;
      product.reviews.forEach((rev) => {
        avg += rev.rating;
      });
      product.ratings = avg / product.reviews.length;
      await product.save({ validateBeforeSave: false });

      await Order.findByIdAndUpdate(
        orderId,
        {
          $set: { "cart.$[elem].isReviewed": true },
        },
        {
          arrayFilters: [{ "elem._id": productId }],
          new: true,
        }
      );

      res.status(200).json({
        success: true,
        message: "Reviewed Successfuly!",
      });
    } catch (error) {
      return next(new ErrorHandler(error, 400));
    }
  })
);
//get all products ---- (Admin)
router.get(
  "/admin-all-products",
  isAthuenticated,
  isAdmin("Admin"),
  catchAsyncError(async (req, res, next) => {
    try {
      const products = await Product.find().sort({
        createdAt: -1,
      });
      res.status(200).json({
        success: true,
        products,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
module.exports = router;
