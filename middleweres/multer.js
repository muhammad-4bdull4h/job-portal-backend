import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "jobPortal_Dev",
    allowedFormats: ["png", "jpg", "jpeg", "webp"],
  },
});

export const clouDelete = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id, function (result) {
      console.log(result);
    });
  } catch (err) {
    console.log(err);
  }
};

export const upload = multer({ storage });
