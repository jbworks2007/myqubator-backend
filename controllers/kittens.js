const { response } = require("express");
const Kitten = require("../models/kittens");

// Example response from mongoose 8 docs
exports.addKitty = async (req, res) => {
  let { name } = req.body;
  console.log("kittyname : ", name);

  let newKitty = new Kitten({ name: name });
  await newKitty
    .save()
    .then((kitty) => {
      return res.json({
        code: "success",
        message: "Kitty save succesfully",
        status: 200,
        kitty,
      });
    })
    .catch((err) => {
      return res.json({
        error: err,
        message: "Database Error",
        code: "server_error",
      });
    });
};
