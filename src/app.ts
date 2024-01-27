import express, { Express } from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bodyParser from "body-parser";
import userRoute from "./routes/user_route";
import userPostRoute from "./routes/user_post_route";

const initApp = () => {
  const db = mongoose.connection;
  db.on("error", (error) => console.error(error));
  db.once("open", () => console.log("Connected to Database"));
  return new Promise<Express>((resolve, reject) => {
    mongoose
      .connect(process.env.DB_URL)
      .then(() => {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use("/user", userRoute);
        app.use("/userpost", userPostRoute);
        resolve(app);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
export = initApp;
