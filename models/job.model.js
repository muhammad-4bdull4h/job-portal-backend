import mongoose, { Schema, Types } from "mongoose";

const jobSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: Array,
    },
    salary: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    jobType: {
      type: String,
      required: true,
    },
    position: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    Company: {
      type: Types.ObjectId,
      required: true,
      ref: "Company",
    },
    created_by: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    applications: [{ type: Types.ObjectId, ref: "Application" }],
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
