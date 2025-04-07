const mongoose = require("mongoose");

const googleSignIn = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  sub: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // Optional: OTP expires after 5 mins
  },
});

module.exports = mongoose.model("GoogleSignIn", googleSignIn);
