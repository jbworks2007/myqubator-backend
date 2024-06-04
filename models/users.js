const mongoose = require("mongoose");
const moment = require("moment");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
    },
    pass: {
      type: String,
      trim: true,
      required: true,
    },
    role: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    is_verified: {
      type: Boolean,
      default: false,
      required: true,
    },
    registered_at: {
      type: Date,
      default: moment(),
    },
  },
  { timestamp: true }
);
module.exports = mongoose.model("User", userSchema);
