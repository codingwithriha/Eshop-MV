const express = require("express");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncError = require("../middleware/catchAsyncErrors");
const router = express.Router();
const Order = require("../model/order");
const Product = require("../model/product");
const { isSeller, isAdmin, isAthuenticated } = require("../middleware/auth");
const Shop = require("../model/shop");
//create Order (User)
router.post(
  "/create-order",
  catchAsyncError(async (req, res, next) => {
    try {
      const { cart, shippingAddress, user, totalPrice, paymentInfo } = req.body;
      //   group cart items by shopId
      const shopItemsMap = new Map();

      for (const item of cart) {
        const shopId = item.shopId;
        if (!shopItemsMap.has(shopId)) {
          shopItemsMap.set(shopId, []);
        }
        shopItemsMap.get(shopId).push(item);
      }

      // create an order for each shop
      const orders = [];

      for (const [shopId, items] of shopItemsMap) {
        const order = await Order.create({
          cart: items,
          shippingAddress,
          user,
          totalPrice,
          paymentInfo,
        });
        orders.push(order);
      }
      res.status(201).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
//Get All Orders (User)
router.get(
  "/get-all-orders/:userId",
  catchAsyncError(async (req, res, next) => {
    try {
      const orders = await Order.find({ "user._id": req.params.userId }).sort({
        createdAt: -1,
      });
      if (!orders) {
        return next(new ErrorHandler("No Order Found", 404));
      }
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
//get all orders (Seller)
router.get(
  `/get-seller-all-orders/:shopId`,
  catchAsyncError(async (req, res, next) => {
    try {
      const orders = await Order.find({
        "cart.shopId": req.params.shopId,
      }).sort({
        createdAt: -1,
      });
      if (!orders) {
        return next(new ErrorHandler("No Order Found", 404));
      }
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
//Update Order Status (seller)
router.put(
  "/update-order-status/:id",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) {
        return next(new ErrorHandler("Order Not Found", 400));
      }
      if (req.body.status === "Transferred to delivery partner") {
        order.cart.forEach(async (o) => {
          await updateOrder(o._id, o.qty);
        });
      }
      if (req.body.status === "Delivered") {
        order.deliveredAt = Date.now();
        order.paymentInfo.status = "succeeded";
        const serviceCharge = order.totalPrice * 0.1;
        await upDateSellerInfo(order.totalPrice - serviceCharge);
      }
      order.status = req.body.status;
      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
      });
      // Update seller-Info for the Balance
      async function upDateSellerInfo(amount) {
        const seller = await Shop.findById(req.seller.id);
        seller.availableBalance = amount;
        await seller.save();
      }
      // Define updateOrder function
      async function updateOrder(id, qty) {
        const product = await Product.findById(id);
        if (product) {
          product.stock -= qty;
          product.sold_out += qty;
          await product.save({ validateBeforeSave: false });
        }
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
// give a refund ( user)
router.put(
  "/order-refund/:id",
  catchAsyncError(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found ", 400));
      }

      order.status = req.body.status;

      await order.save({ validateBeforeSave: false });

      res.status(200).json({
        success: true,
        order,
        message: "Order Refund Request Successfully!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
//accept the refund (Seller)
router.put(
  "/order-refund-success/:id",
  isSeller,
  catchAsyncError(async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return next(new ErrorHandler("Order not found ", 400));
      }
      order.status = req.body.status;
      await order.save();
      res.status(200).json({
        success: true,
        message: "Order Refund Successfull!",
      });
      if (req.body.status === "Refund Success") {
        for (const o of order.cart) {
          await updateOrder(o._id, o.qty);
        }
      }

      async function updateOrder(id, qty) {
        const product = await Product.findById(id);
        if (product) {
          product.stock += qty;
          product.sold_out -= qty;
          await product.save({ validateBeforeSave: false });
        }
      }
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);
// All Orders for the Admin
router.get(
  "/admin-all-orders",
  isAthuenticated,
  isAdmin("Admin"),
  catchAsyncError(async (req, res, next) => {
    try {
      const orders = await Order.find().sort({
        deliveredAt: -1,
        createdAt: -1,
      });
      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;
