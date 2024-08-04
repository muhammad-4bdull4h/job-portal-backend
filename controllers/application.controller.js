import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.userId;
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(404).json({ message: "Job jot found" });
    }

    const existingApplication = await Application.findOne({
      $and: {
        applicant: userId,
        job: jobId,
      },
    });
    console.log();

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    job.applications.push(newApplication._id);
    await job.save();

    res.status(200).json({ success: true, message: "applied successfully" });
  } catch (error) {
    console.log(error);
  }
};

export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.userId;
    const applications = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: {
          sort: { createdAt: -1 },
        },
        populate: {
          path: "Company",
          options: {
            sort: { createdAt: -1 },
          },
        },
      });

    if (!applications) {
      return res.status(404).json({ message: "No applications found" });
    }

    res.status(200).json({ success: true, data: applications });
  } catch (error) {
    console.log(error);
  }
};

//getting applicants for admin of the job
export const getApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      populate: {
        path: "applicant",
        select: "-password",
      },
    });

    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    res.status(200).json({
      success: true,
      job: job,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { applicationId } = req.params;

    if (!status) {
      return res
        .status(400)
        .json({ success: false, message: "Status is required" });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res
        .status(404)
        .json({ success: false, message: "Application not found" });
    }

    application.status = status.toLowerCase();

    application.save();

    res
      .status(200)
      .json({ success: true, message: "status updated successsfully" });
  } catch (error) {
    console.log(error);
  }
};
