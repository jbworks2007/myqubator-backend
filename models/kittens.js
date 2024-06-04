const mongoose = require("mongoose");

// Example schema from mongoose 8 docs
const kittySchema = new mongoose.Schema({
  name: String,
});

module.exports = mongoose.model("Kitten", kittySchema);
