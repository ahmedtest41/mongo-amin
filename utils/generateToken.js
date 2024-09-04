const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const generateToken = (userId) => {
  console.log("Generating token for userId:", userId); // سجل تتبع
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "90d",
  });
  console.log("Generated token:", token); // سجل تتبع

  return token;
};

module.exports = generateToken;
