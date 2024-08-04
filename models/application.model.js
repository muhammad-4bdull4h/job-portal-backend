import mongoose, { Schema, Types } from "mongoose";

const applicationSchema =  new Schema(
  {
    job: {
      type: Types.ObjectId,
      required: true,
      ref: "Job",
    },
    applicant: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const Application = mongoose.model("Application", applicationSchema);
