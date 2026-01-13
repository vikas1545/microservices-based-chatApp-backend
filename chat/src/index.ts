import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import chatRoutes from "./routes/chat.js";
import cors from 'cors';
import { app, server } from "./config/Socket.js";

dotenv.config();
connectDb();
const port = process.env.PORT;
app.use(cors())

app.use(express.json());
app.use("/api/v1", chatRoutes);

server.listen(port, () => {
  console.log(`chat server started on ${port}`);
});
