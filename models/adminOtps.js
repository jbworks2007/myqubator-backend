const mongoose = require("mongoose");
const crypto = require("crypto");
const moment = require("moment");

const adminOtpsSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
    },
    phone: {
      type: Number,
      trim: true,
    },
    otp: {
      type: Number,
      trim: true,
    },
    is_valid: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: moment(),
    },
  },
  { timestamp: true }
);

// otpSchema.index({ "createdAt": 1 }, { expireAfterSeconds: 300 });

module.exports = mongoose.model("AdminOtp", adminOtpsSchema);
