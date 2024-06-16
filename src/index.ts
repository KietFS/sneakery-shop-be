require("dotenv").config();
import "reflect-metadata";
import express, { text } from "express";
import mongoose from "mongoose";
import cors from "cors";

const main = async () => {
  const app = express();
  //Session, cookies store
  const mongoUrl = `mongodb+srv://${process.env.DB_USER_NAME_DEV}:${process.env.DB_PASSWORD_DEV}@cluster0.1ojo2c3.mongodb.net/?retryWrites=true&w=majority`;

  try {
    await mongoose.connect(mongoUrl, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
  } catch (error) {
    console.log("MONGODB Connect Eroor", error);
  }

  //PORT
  const PORT = process.env.PORT || 4000;
  app.use(cors());
  app.use(express.json());

  //list of routes
  const userRoute = require("./routes/User");
  const adminRoute = require("./routes/Admin");
  const productRoute = require("./routes/Product");
  const cartRoute = require("./routes/Cart");
  const orderRoute = require("./routes/Order");
  const commentRoute = require("./routes/Comment");
  const favouriteProductRoutes = require("./routes/FavouriteProduct");

  app.use("/admin", adminRoute);
  app.use("/users", userRoute);
  app.use("/products", productRoute);
  app.use("/carts", cartRoute);
  app.use("/orders", orderRoute);
  app.use("/comments", commentRoute);
  app.use("/favourite-products", favouriteProductRoutes);

  //listen on port
  app.listen(PORT, () => {
    console.log(`Server started on localhost:${PORT}`);
  });
};

main().catch((error) => console.log("ERROR", error));
