const express = require("express");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { upload } = require("../multer");
const sendMail = require("../utils/sendMail");
const sendShopToken = require("../utils/shopToken");
const { isSeller, isAthuenticated, isAdmin } = require("../middleware/auth");
const ErrorHandler = require("../utils/ErrorHandler");
const Shop = require("../model/shop");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const cloudinary = require("cloudinary").v2;
//craete Shop
router.post("/create-shop", async (req, res, next) => {
  try {
    const { name, email, password, address, zipCode, phoneNumber } = req.body;
    if (!name || !email || !password) {
      return next(new ErrorHandler("All Fields are Required!", 400));
    }
    const Selleremail = await Shop.findOne({ email });
    if (Selleremail) {
      return next(new ErrorHandler("Seller is Already Exist!", 400));
    }
    const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
      folder: "avatars",
    });
    const seller = {
      name,
      email,
      password,
      address,
      zipCode,
      phoneNumber,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    };
    const activationToken = createActivationToken(seller);
    const activationUrl = `http://localhost:3000/seller/activation/${activationToken}`;
    try {
      await sendMail({
        email: seller.email,
        subject: "Activate Your Seller Account!",
        message: `Hello!\n Dear ${seller.name} Seller!\n Please click on the link below to activate your account \n${activationUrl}`,
      });
      res.status(201).json({
        success: true,
        message: `Please check your email:-${seller.email} to activate your account!`,
      });
    } catch (error) {
      next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    next(new ErrorHandler(error.message, 500));
  }
});
//create activation Token (Function)
const createActivationToken = (seller) => {
  return jwt.sign(seller, process.env.ACTIVATION_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};
//activate the Shop
router.post(
  "/activation",
  catchAsyncError(async (req, res, next) => {
    try {
      const { activation_token } = req.body;

      const newSeller = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET
      );

      if (!newSeller) {
        return next(new ErrorHandler("Invalid token", 400));
      }
      const {
        name,
        email,
        password,
        avatar,
        zipCode,
        address,
        phoneNumber,
      } = newSeller;

      let seller = await Shop.findOne({ email });

      if (seller) {
        return next(new ErrorHandler("User already exists", 400));
      }

      seller = await Shop.create({
        name,
        email,
        avatar,
        password,
        zipCode,
        address,
        phoneNumber,
      });

      sendShopToken(seller, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
//login to Our Shop
router.post(
  "/login-shop",
  catchAsyncError(async (req, res, next) => {
    try {
      let { email, password } = req.body;
      if (!email || !password)
        return next(new ErrorHandler("All Fileds are required!", 500));
      const seller = await Shop.findOne({ email }).select("+password");
      if (!seller) {
        return next(new ErrorHandler("Seller Does't Exist!", 400));
      }
      const ValidPassword = await seller.comparePassword(password);
      if (!ValidPassword) {
        return next(
          new ErrorHandler("Please,Provide the correct information!", 400)
        );
      }
      sendShopToken(seller, 201, res);
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
//Load Our Shop
router.get(
  "/get-seller",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller._id);
      if (!seller) {
        return next(new ErrorHandler("User does'nt exist!", 400));
      }
      res.status(200).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
// LogOut Shop
router.get(
  "/logout",
  catchAsyncError(async (reeq, res, next) => {
    try {
      res.cookie("shop_token", "", {
        expires: new Date(Date.now()),
        httpOnly: true,
      });
      res.status(201).json({
        success: true,
        message: "Logout Successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
//get shopInfo
router.get(
  "/get-shop-info/:id",
  catchAsyncError(async (req, res, next) => {
    try {
      //this will return an object
      const shop = await Shop.findById(req.params.id);
      if (!shop) {
        return next(new ErrorHandler("Seller does'nt exist!", 400));
      }
      res.status(200).json({
        success: true,
        shop,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
//Update Shop Info
router.put(
  "/update-shop-avatar",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const existSeller = await Shop.findById(req.seller._id);
      const imageId = existSeller.avatar.public_id;
      await cloudinary.uploader.destroy(imageId);

      const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
      });
      existSeller.avatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };

      await existSeller.save();
      res.status(200).json({
        success: true,
        seller: existSeller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
//Update Seller Info
router.put(
  "/update-seller-info",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const { name, description, address, phoneNumber, zipCode } = req.body;
      const seller = await Shop.findOne(req.seller._id);

      if (!seller) {
        return next(new ErrorHandler("Seller not found!", 400));
      }

      seller.name = name;
      seller.description = description;
      seller.address = address;
      seller.phoneNumber = phoneNumber;
      seller.zipCode = zipCode;
      await seller.save();
      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
//get all seller ---- (Admin)
router.get(
  "/admin-all-sellers",
  isAthuenticated,
  isAdmin("Admin"),
  catchAsyncError(async (req, res, next) => {
    try {
      const sellers = await Shop.find().sort({
        createdAt: -1,
      });
      res.status(200).json({
        success: true,
        sellers,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
//admin delte seller
router.delete(
  "/admin-delete-seller/:id",
  isAthuenticated,
  isAdmin("Admin"),
  catchAsyncError(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.params.id);
      if (!seller) {
        return next(
          new ErrorHandler(`Admin is not available with this ${id}!`, 400)
        );
      }
      await Shop.findByIdAndDelete(req.params.id);
      res.status(200).json({
        success: true,
        message: "Seller Deleted Successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
//update seller with-draw-methtods ---admin
router.put(
  `/update-payment-methods`,
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const { withdrawMethod } = req.body;
      const seller = await Shop.findByIdAndUpdate(req.seller._id, {
        withdrawMethod,
      });
      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
//delete seller with-draw-methtods --->Seller
router.delete(
  `/delete-withdraw-methods`,
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const seller = await Shop.findById(req.seller?._id);
      if (!seller) {
        return next(new ErrorHandler("Seller not found with this ID", 400));
      }
      seller.withdrawMethod = null;
      await seller.save();
      res.status(201).json({
        success: true,
        seller,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
