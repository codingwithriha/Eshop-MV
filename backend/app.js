const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const ErrorHandler = require("./middleware/error");

const app = express();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Serve static files from /uploads via /uploads path
app.use("/uploads", express.static("uploads"));
// Root route
app.get("/", (req, res) => {
  res.send("API is running :visit:  /health for status");
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
});

// Config - Load environment variables if not in production
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "config/.env" });
}

//Import Routes
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const event = require("./controller/event");
const coupon = require("./controller/coupounCode");
const payment = require("./controller/payment");
const order = require("./controller/order");
const converation = require("./controller/conversation");
const message = require("./controller/message");
const withdraw = require("./controller/withdraw");
//Mount Routes
app.use("/api/v2/user", user);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/coupon", coupon);
app.use("/api/v2/payment", payment);
app.use("/api/v2/order", order);
app.use("/api/v2/conversation", converation);
app.use("/api/v2/message", message);
app.use("/api/v2/withdraw", withdraw);

// Catch-all 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
    method: req.method,
  });
});

// Global Error Handling Middleware
app.use(ErrorHandler);

module.exports = app;
