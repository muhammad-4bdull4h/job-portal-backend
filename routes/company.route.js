import express, { Router } from "express";
import { authMiddlewere } from "../middleweres/auth.js";
import {
  getCompany,
  getCompanyById,
  registerCompany,
  updateCompany,
} from "../controllers/company.controller.js";
import { upload } from "../middleweres/multer.js";

const companyRouter = Router();

companyRouter
  .route("/register")
  .post(authMiddlewere, upload.single("file"), registerCompany);
companyRouter.route("/get").get(authMiddlewere, getCompany);
companyRouter.route("/get/:companyId").get(authMiddlewere, getCompanyById);
companyRouter
  .route("/update/:companyId")
  .patch(authMiddlewere, upload.single("file"), updateCompany);
export default companyRouter;
