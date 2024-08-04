import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import { Application } from "../models/application.model.js";

export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;

    const userId = req.userId;

    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position ||
      !companyId
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill in all fields" });
    }

    const foundCompany = await Company.findById(companyId);
    if (!foundCompany) {
      return res
        .status(400)
        .json({ success: false, message: "Company doesn't exist" });
    }

    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experience,
      position,
      Company: companyId,
      created_by: userId,
    });

    res
      .status(200)
      .json({ success: true, message: "job created successfull", data: job });
  } catch (error) {
    console.log(error);
  }
};

// get jobs for queries
export const getJobs = async (req, res) => {
  try {
    const { keyword } = req.query || "";

    let query = {};

    if (keyword) {
      const newKeyWord = keyword.replaceAll("+", " ");
      const [minString, maxString] = newKeyWord.split("-");
      if (!isNaN(minString)) {
        query = {
          salary: { $gte: parseFloat(minString), $lte: parseFloat(maxString) },
        };
      } else {
        query = {
          $or: [
            { title: { $regex: newKeyWord, $options: "i" } },
            { description: { $regex: newKeyWord, $options: "i" } },
            { location: { $regex: newKeyWord, $options: "i" } },
          ],
        };
      }
    } else {
      query = {};
    }

    const jobs = await Job.find(query).populate("Company");

    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ success: false, message: "No jobs found" });
    }

    res.status(200).json({ success: true, jobs: jobs });
  } catch (error) {
    console.log(error);
  }
};

// get job by id to show

export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId)
      .populate("Company")
      .populate("applications");

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({ success: true, job: job });
  } catch (error) {
    console.log(error);
  }
};

// jobs posted by owner or admin
export const getJobsOfAdmin = async (req, res) => {
  try {
    const adminId = req.userId;
    const jobs = await Job.find({ created_by: adminId }).populate("Company");

    if (!jobs) {
      return res
        .status(404)
        .json({ success: false, message: "No jobs Posted" });
    }

    res.status(200).json({ success: true, jobs: jobs });
  } catch (error) {
    console.log(error);
  }
};

// jobs applied by user
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.userId;
    const applications = await Application.find({ applicant: userId }).populate(
      {
        path: "job",
        populate: {
          path: "Company",
        },
      }
    );

    if (!applications) {
      return res
        .status(404)
        .json({ success: false, message: "No jobs Posted" });
    }

    res.status(200).json({ success: true, appliedJobs: applications });
  } catch (error) {
    console.log(error);
  }
};
