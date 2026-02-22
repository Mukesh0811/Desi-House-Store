// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,

  resetOtp: String,
  resetOtpExpiry: Date,
});

module.exports = mongoose.model("User", userSchema);
