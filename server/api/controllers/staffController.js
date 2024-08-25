const Joi = require("joi");
const cloudinary = require("../../utils/cloudinary");
const Staff = require("../models/staff");
const { formattedResult } = require("../utils/Consts");

// Joi validation schema
const validateStaff = (staff) => {
  const schema = Joi.object({
    staff_name: Joi.string().required(),
    staff_position: Joi.string().required(),
    staff_featured: Joi.boolean().optional(),
    pictures: Joi.any().required(),
  });
  return schema.validate(staff);
};

// Get all staff
exports.getStaff = async (req, res) => {
  try {
    const staff = await Staff.findAll({});
    const result = formattedResult(staff);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch staff", error: error.message });
  }
};
// Post a new event
exports.postStaff = async (req, res) => {
  // Validate the incoming request data
  const { error } = validateStaff(req.body);
  if (error) {
    return res.status(400).json({
      message: "Please Fill in all the Fields",
      error: error.details[0].message,
    });
  }

  try {
    const { staff_name, staff_position, staff_featured, pictures } = req.body;

    // Create the event in the database
    const staff = await Staff.create({
      staff_name,
      staff_position,
      staff_featured,
      pictures: [],
    });

    const folderName = `${process.env.CLOUDINARY_DB}/staff_${staff.staff_id}`;

    // Upload pictures to Cloudinary
    const uploadPromises = pictures?.map((base64Data) => {
      return cloudinary.uploader.upload(base64Data, {
        folder: folderName,
      });
    });

    const uploadedImages = await Promise.all(uploadPromises);

    // Update the staff with the uploaded images
    await staff.update({ pictures: uploadedImages });

    res.status(201).json({ message: "Staff created successfully", staff });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create staff", error: error.message });
  }
};
// Delete an staff
exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await Staff.findByPk(id);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    const { pictures } = staff;
    const folderName = pictures[0]?.folder;

    const deletePromises = pictures.map((picture) =>
      cloudinary.uploader.destroy(picture.public_id)
    );
    await Promise.all(deletePromises);

    const filesInFolder = await cloudinary.api.resources({
      type: "upload",
      prefix: folderName,
    });

    const deleteFilePromises = filesInFolder.resources.map((file) =>
      cloudinary.uploader.destroy(file.public_id)
    );

    await Promise.all(deleteFilePromises);

    await cloudinary.api.delete_folder(folderName);
    await staff.destroy();

    res.status(200).json({ message: "staff deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete staff", error: error.message });
  }
};
