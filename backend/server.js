const path = require("path");

// Load env before any module reads process.env
require("dotenv").config({
  path: path.join(__dirname, "config/.env"),
});

const app = require("./app");
const dbConnection = require("./db/Database");
const cloudinary = require("cloudinary").v2;

process.on("uncaughtException", (error) => {
  console.log(`Error: ${error.message}`);
  console.log("Shutting Down Server (uncaughtException)");
});

// Keep database connection
dbConnection();

// Keep Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Run a local Express listener during development. Vercel invokes the exported
// app directly, so do not start a second listener in the serverless runtime.
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Eshop-MV API listening on port ${PORT}`);
  });
}

process.on("unhandledRejection", (error) => {
  console.log(`Error: ${error.message}`);
});

// Export app for Vercel
module.exports = app;