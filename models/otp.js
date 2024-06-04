const mongoose = require("mongoose");
const moment = require("moment");

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
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

module.exports = mongoose.model("Otp", otpSchema);
