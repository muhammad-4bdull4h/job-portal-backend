import mongoose, { Schema, Types } from "mongoose";

const companySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    website: {
      type: String,
    },
    location: {
      type: String,
    },
    logo: {
      url: {
        type: String,
      },
      filename: {
        type: String,
      },
    },
    userId: {
      type: Types.ObjectId,
      reqired: true,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Company = mongoose.model("Company", companySchema);
