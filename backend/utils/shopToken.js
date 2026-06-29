const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  };
};

// create token and saving that in cookies
const sendShopToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  res
    .status(statusCode)
    .cookie("seller_token", token, getCookieOptions())
    .json({
      success: true,
      user,
      token,
    });
};

module.exports = sendShopToken;
