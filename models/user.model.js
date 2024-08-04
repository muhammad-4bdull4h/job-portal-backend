import mongoose, { Schema } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "recruiter"],
      required: true,
    },
    profile: {
      bio: { type: String },
      skills: [],
      resume: { type: String },
      resumeOriginalName: { type: String },
      company: { type: Schema.Types.ObjectId, ref: "Company" },
      profilePhoto: {
        url: String,
        filename: String,
      },
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
