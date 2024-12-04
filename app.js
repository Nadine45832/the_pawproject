const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const serverConfig = require("./configs/server.js");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/users-routes");
const petRouter = require('./routes/pets-routes');
const HttpError = require("./models/http-error");
const cors = require('cors');
const path = require('path');

const app = express();

app.use("/upload/images", express.static(path.join("upload", "images")));

app.use(bodyParser.json());
app.use(cookieParser(serverConfig.cookieSecret));
app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Users routes
app.use("/api/users", userRouter);
app.use("/api/pets", petRouter);

// Middleware for non-existent routes
app.use((req, res, next) => {
  next(new HttpError("Could not find the route.", 404));
});

// Centralized Error handling middleware
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  console.error(`[ERROR] ${error.message}`);
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose
  .connect(
    `mongodb+srv://${serverConfig.mongo_login}:${serverConfig.mongo_password}@petclaster.dxpqd.mongodb.net/?retryWrites=true&w=majority&appName=petClaster`,
  )
  .then(() => {
    app.listen(8080, () => console.log("Server running on port 8080"));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });