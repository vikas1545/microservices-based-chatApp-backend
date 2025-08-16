import express from "express";
import dotenv from 'dotenv';
import { startSendOtpConsumer } from "./consumer.js";
dotenv.config();
startSendOtpConsumer();
const app = express();
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`mail server started on ${port}`);
});
