const express = require("express");
const router = express.Router();
const { addKitty } = require("../controllers/kittens");

router.post("/addkitty", addKitty); // Example route from mongoose 8 docs

module.exports = router;
