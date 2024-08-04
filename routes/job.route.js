import express, { Router } from "express";
import {
  getAppliedJobs,
  getJobById,
  getJobs,
  getJobsOfAdmin,
  postJob,
} from "../controllers/job.controller.js";
import { authMiddlewere } from "../middleweres/auth.js";

const jobRouter = Router();

jobRouter.route("/post").post(authMiddlewere, postJob);
jobRouter.route("/get").get(getJobs);
jobRouter.route("/get/job/:jobId").get(getJobById);
jobRouter.route("/get/appliedjobs").get(authMiddlewere, getAppliedJobs);
jobRouter.route("/get/adminjobs").get(authMiddlewere, getJobsOfAdmin);

export default jobRouter;
