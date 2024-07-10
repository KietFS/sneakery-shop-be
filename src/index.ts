require("dotenv").config();
import "reflect-metadata";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const main = async () => {
  const app = express();
  //Session, cookies store
  const mongoUrl = `mongodb+srv://${process.env.DB_USER_NAME_DEV}:${process.env.DB_PASSWORD_DEV}@cluster0.1ojo2c3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

  console.log("MOGO DB URL", mongoUrl);
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
  app.listen(4000, () => {
    console.log(`Server started on localhost: 4000`);
  });

  app.get("/", () => "Hello World");
};

main().catch((error) => console.log("ERROR", error));
