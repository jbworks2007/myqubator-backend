const mongoose = require("mongoose");
const moment = require("moment");

const projectSchema = new mongoose.Schema(
  {
    project_id: {
      type: String,
      trim: true,
      required: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    views: {
      type: Number,
      trim: true,
      default: 0,
    },
    shares: {
      type: Number,
      trim: true,
      default: 0,
    },
    documents: [
      {
        doc_id: {
          type: String,
          trim: true,
          required: true,
        },
        doc_name: {
          type: String,
          trim: true,
          required: true,
        },
        views: {
          type: Number,
          trim: true,
          default: 0,
        },
        shares: {
          type: Number,
          trim: true,
          default: 0,
        },
      },
    ],
    legal_documents: [
      {
        doc_id: {
          type: String,
          trim: true,
          required: true,
        },
        doc_name: {
          type: String,
          trim: true,
          required: true,
        },
        views: {
          type: Number,
          trim: true,
          default: 0,
        },
        shares: {
          type: Number,
          trim: true,
          default: 0,
        },
      },
    ],
    registered_at: {
      type: Date,
      default: moment(),
    },
  },
  { timestamp: true }
);
module.exports = mongoose.model("Project", projectSchema);
