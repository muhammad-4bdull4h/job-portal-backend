import express, { Router } from "express";
import { authMiddlewere } from "../middleweres/auth.js";
import {
  applyJob,
  getApplicants,
  getAppliedJobs,
  updateStatus,
} from "../controllers/application.controller.js";

const applicationRouter = Router();

applicationRouter.route("/applyjob/:jobId").get(authMiddlewere, applyJob);
applicationRouter.route("/get").get(authMiddlewere, getAppliedJobs);
applicationRouter.route("/applicant/:jobId").get(authMiddlewere, getApplicants);
applicationRouter
  .route("/status/:applicationId")
  .patch(authMiddlewere, updateStatus);
export default applicationRouter;
