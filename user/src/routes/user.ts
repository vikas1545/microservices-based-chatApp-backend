import express from "express";
import { getAllUsers, getUser, loginUser, myProfile, updateName, verifyUser } from "../controllers/user.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/verify", verifyUser);
router.get("/me", isAuth, myProfile);
router.get("/user/:id", getUser);
router.get("/all-users", isAuth, getAllUsers);
router.post("/updateName", isAuth, updateName);
export default router;
