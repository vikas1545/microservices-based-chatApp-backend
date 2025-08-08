import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import { createClient } from "redis";
dotenv.config();
connectDb();

export const redisClient = createClient({ url: process.env.REDIS_URL });
redisClient
  .connect()
  .then(() => console.log("Connected to Redis"))
  .catch((error) => {
    console.error("Error in Redis connection:", error);
  });

const app = express();

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`server started on ${port}`);
});
