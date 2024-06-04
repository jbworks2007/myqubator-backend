const mongoose = require("mongoose");
const moment = require("moment");

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    phone: {
      type: Number,
      default: null,
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    city: {
      type: String,
      trim: true,
      default: "",
    },
    pincode: {
      type: Number,
      default: null,
    },
    profile_pic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
    },
    omc_type: {
      type: String,
    },
    omc_type_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OMC",
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
    permissions: [],
    last_password_updated: {
      type: Date,
      default: moment(),
    },
    registered_at: {
      type: Date,
      default: moment(),
    },
  },
  { timestamp: true }
);
module.exports = mongoose.model("Admin", adminSchema);
