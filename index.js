const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// bring routes
// const kittyRoutes = require("./routes/kittens"); // Example api from mongoose 8 docs
const authRoutes = require("./routes/auth");
const emailRoutes = require("./routes/sendemail");
const projectRoutes = require("./routes/projects");

const port = process.env.PORT || 4000;
const app = express();

app.use(cors({ origin: "*" }));
app.options("*", cors());

app.use(express.json());

// db
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Database connected !"))
  .catch((err) => console.log(err));

// routes middleware
// app.use("/api/kitty", kittyRoutes); // Example api from mongoose 8 docs
app.use("/myq/api/auth", authRoutes);
app.use("/myq/api/email", emailRoutes);
app.use("/myq/api/project", projectRoutes);

//public data serve
// app.use("/api/images", express.static("public"));
// app.use("/api/articles", express.static("uploads"));

app.get("/", (req, res) => {
  res.json({ message: "server is running" });
});

//Invalid route handling
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 404);
  res.json({
    error: error.message,
  });
});

// Server start
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
