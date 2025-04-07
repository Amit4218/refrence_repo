const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // Optional: OTP expires after 5 mins
  },
});

module.exports = mongoose.model("OPT", otpSchema);
