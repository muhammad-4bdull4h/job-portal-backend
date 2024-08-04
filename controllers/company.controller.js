import { clouDelete } from "../middleweres/multer.js";
import { Company } from "../models/company.model.js";

export const registerCompany = async (req, res) => {
  try {
    const { companyName, description, website, location } = req.body;
    console.log(req.file);
    const url = req.file?.path;
    let fileName = req.file?.filename;

    if (!companyName) {
      return res
        .status(400)
        .json({ success: false, message: "company name is required" });
    }

    const foundCompany = await Company.findOne({ name: companyName });

    if (foundCompany) {
      return res.status(400).json({
        success: false,
        message: "company already Exists.You cant register it with this name",
      });
    }

    const companyData = new Company({
      name: companyName,
      description: description,
      userId: req.userId,
      location: location,
      website: website,
      logo: {
        url: url || null,
        filename: fileName || null,
      },
    });

    const company = await companyData.save();

    res.status(201).json({
      success: true,
      message: "company registered successfully",
      company,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error });
  }
};

export const getCompany = async (req, res) => {
  try {
    const companies = await Company.find({ userId: req.userId });
    if (!companies) {
      return res
        .status(404)
        .json({ success: false, message: "company not found" });
    }

    res.status(200).json({ success: true, companies: companies });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.companyId;
    const company = await Company.findById(companyId);

    console.log(company);

    if (!company) {
      return res
        .status(404)
        .json({ success: false, message: "company not found" });
    }

    res.status(200).json({ success: true, data: company });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { companyName, description, location, website } = req.body;
    const url = req.file?.path;
    const fileName = req.file?.filename;

    if (req.file) {
      const imgCompany = await Company.findById(req.params.companyId);
      if (imgCompany.logo.filename) {
        await clouDelete(imgCompany.logo.filename);
      }
    }

    const updateFields = {};

    if (companyName) updateFields.name = companyName;
    if (description) updateFields.description = description;
    if (location) updateFields.location = location;
    if (website) updateFields.website = website;
    if (url) updateFields["logo.url"] = url;
    if (fileName) updateFields["logo.filename"] = fileName;

    const company = await Company.findByIdAndUpdate(
      req.params.companyId,
      {
        $set: updateFields,
      },
      { new: true }
    );

    if (!company) {
      return res
        .status(400)
        .json({ success: false, message: "Company did'nt updated" });
    }

    res.status(200).json({ success: true, message: "Company updated" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error });
  }
};
