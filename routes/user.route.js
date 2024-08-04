import express, { Router } from "express";
import {
  getUserData,
  getUserProfile,
  login,
  logOut,
  registerUser,
  UpdateProfile,
} from "../controllers/user.controller.js";
import { authMiddlewere } from "../middleweres/auth.js";
import { upload } from "../middleweres/multer.js";

const userRouter = Router();

userRouter.route("/register").post(upload.single("file"), registerUser);
userRouter.route("/login").post(login);
userRouter.route("/logout").get(logOut);
userRouter.route("/info").get(authMiddlewere, getUserData);
userRouter.route("/profile/:id").get(getUserProfile);
userRouter
  .route("/profile/update")
  .patch(upload.single("image"), authMiddlewere, UpdateProfile);

export default userRouter;
