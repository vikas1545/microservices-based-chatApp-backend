import { generateToken } from "../config/generateToken.js";
import { publishToQueue } from "../config/rabbitmq.js";
import TryCatch from "../config/TryCatch.js";
import { redisClient } from "../index.js";
import { AuthenticatedRequest } from "../middlewares/isAuth.js";
import { User } from "../model/User.js";

export const loginUser = TryCatch(async (req, res) => {
  const { email } = req.body;

  const rateLimitKey = `otp:ratelimit:${email}`;
  const rateLimit = await redisClient.get(rateLimitKey);
  if (rateLimit) {
    res.status(429).json({
      message: "Too many requests. Please wait for sending otp again",
    });
    return;
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpKey = `otp:${email}`;
  await redisClient.set(otpKey, otp, {
    EX: 300, //300 sec
  });

  await redisClient.set(rateLimitKey, "true", {
    EX: 60,
  });

  const message = {
    to: email,
    subject: "OTP Code",
    body: `Your OTP is ${otp}. It is valid for 5 minutes`,
  };

  await publishToQueue("send-otp", message);

  res.status(200).json({ message: "An otp has been sent on your email" });
});

export const verifyUser = TryCatch(async (req, res) => {
  const { email, otp: enteredOtp } = req.body;

  if (email || !enteredOtp) {
    return res.status(400).json({ message: "Email & OTP are required" });
  }

  const otpKey = `otp:${email}`;
  const storedOtp = await redisClient.get(otpKey);
  if (!storedOtp || storedOtp !== enteredOtp) {
    return res.status(400).json({ message: "Invalid or expired OTP " });
  }

  let user = await User.findOne({ email });
  if (!user) {
    const name = email.slice(0, 8);
    user = await User.create({ name, email });
  }

  const token = generateToken(user);

  res.status(200).json({ message: "User Verified", user, token });
});

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;
  res.json(user);
});
