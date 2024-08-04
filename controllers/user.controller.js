import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { clouDelete } from "../middleweres/multer.js";

const options = {
  httpOnly: true,
  secure: true,
  maxAge: 1 * 24 * 60 * 60 * 1000,
};

const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, phoneNumber, role } = req.body;
    if (!fullName || !email || !password || !phoneNumber || !role) {
      res
        .status(400)
        .json({ success: false, message: "information is missing" });
    }

    const user = await User.findOne({ email: email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "user already exist with this email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullName,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
    });

    res.status(200).json({
      success: true,
      message: "account created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Missing fields",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorect email",
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        success: false,
        message: "account does not exist with current role",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Password",
      });
    }

    const tokenData = {
      userId: user._id,
    };

    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    const userData = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    res
      .status(200)
      .cookie("token", token, options)
      .json({
        success: true,
        user: userData,
        message: `Welcomeback ${user.fullName}`,
      });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error });
  }
};

const logOut = async (req, res) => {
  try {
    return res.status(200).clearCookie("token", options).json({
      success: true,
      message: `logged out sucessfully`,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

const UpdateProfile = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, skills, bio, resume } = req.body;
    const userId = req.userId;
    const url = req.file?.path;
    let fileName = req.file?.filename;

    if (req.file) {
      const user = await User.findById(userId);
      if (user.profile.profilePhoto.filename) {
        await clouDelete(user.profile.profilePhoto.filename);
      }
    }

    if (!fullName || !email || !phoneNumber) {
      return res
        .status(400)
        .json({ success: false, message: "Seomething is missing" });
    }

    const skillsArray = skills?.split(/[\s,]+/);

    const updateFields = {};

    if (fullName) updateFields.fullName = fullName;
    if (email) updateFields.email = email;
    if (phoneNumber) updateFields.phoneNumber = phoneNumber;
    if (bio !== undefined) updateFields["profile.bio"] = bio;
    if (skillsArray?.length) updateFields["profile.skills"] = skillsArray;
    if (resume) updateFields["profile.resume"] = resume;
    if (url) updateFields["profile.profilePhoto.url"] = url;
    if (fileName) updateFields["profile.profilePhoto.filename"] = fileName;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "user updated successfull",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

const getUserData = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    const userData = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    res.status(200).json({
      success: true,
      user: userData,
      message: `Welcomeback ${user.fullName}`,
    });
  } catch (error) {
    console.log(error);
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    const userData = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    res.status(200).json({
      success: true,
      profile: userData,
      message: `User profile`,
    });
  } catch (error) {
    console.log(error);
  }
};

export {
  registerUser,
  login,
  logOut,
  getUserProfile,
  UpdateProfile,
  getUserData,
};
