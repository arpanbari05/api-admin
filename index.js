const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoute");
const todoRouter = require("./routes/todoRoute");
const errorHandler = require("./exceptions/errorHandler");

const app = express();

dotenv.config({
  path: "./config.env",
});

const DB = process.env.DB.replace("<password>", process.env.DB_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected successfully");
  });

app.use(express.json());

app.enable("trust proxy");

app.use(cors());

app.options("*", cors());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/todos", todoRouter);

app.use("*", (req, res, next) => {
  res.status(404).json({
    message: "Can't find this route",
  });
});

app.use(errorHandler);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Listening to port at ${port}`);
});
