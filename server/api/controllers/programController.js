const Joi = require("joi");
const cloudinary = require("../../utils/cloudinary");
const Program = require("../models/program");
const { formattedDatePicResult, formattedResult } = require("../utils/Consts");

// Joi validation schema
const validateProgram = (program) => {
  const schema = Joi.object({
    program_name: Joi.string().required(),
    min_age: Joi.number().min(0).required(),
    max_age: Joi.number().greater(Joi.ref("min_age")).required(),
    program_description: Joi.string().required(),
    pictures: Joi.any().required(),
  });
  return schema.validate(program);
};

// Get all programs
exports.getPrograms = async (req, res) => {
  try {
    const programs = await Program.findAll({});
    const result = formattedResult(programs);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch programs", error: error.message });
  }
};

// Post a new program
exports.postPrograms = async (req, res) => {
  // Validate the incoming request data
  const { error } = validateProgram(req.body);
  if (error) {
    return res.status(400).json({
      message: "Please Fill in all the Fields",
      error: error.details[0].message,
    });
  }
  try {
    const { program_name, min_age, max_age, program_description, pictures } =
      req.body;

    const folderName = `${
      process.env.CLOUDINARY_DB
    }/program_${new Date()?.toISOString()}`;
    // Upload pictures to Cloudinary
    const uploadPromises = pictures?.map((base64Data) => {
      return cloudinary.uploader.upload(base64Data, {
        folder: folderName,
      });
    });

    const uploadedImages = await Promise.all(uploadPromises);
    // Check if any image upload failed
    if (!uploadedImages || uploadedImages.length !== pictures.length) {
      return res
        .status(400)
        .json({ message: "Failed to upload one or more images to Cloudinary" });
    }

    // Create the program in the database
    const program = await Program.create({
      program_name,
      min_age,
      max_age,
      program_description,
      pictures: [],
    });

    // Update the program with the uploaded images
    await program.update({ pictures: uploadedImages });
    res.status(201).json({ message: "Program created successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create program", error: error.message });
  }
};

// Update an existing program
exports.updateProgram = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedData = req.body;

    const program = await Program.findByPk(id);
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    const folderName = `${
      process.env.CLOUDINARY_DB
    }/program_${new Date()?.toISOString()}`;

    const cloudinaryFiles = await cloudinary.api.resources({
      type: "upload",
      prefix: folderName,
    });

    const cloudinaryPublicIds = cloudinaryFiles.resources.map(
      (file) => file.public_id
    );

    const updatedPublicIds = updatedData.pictures
      .map((pic) => pic.public_id)
      .filter(Boolean);
    const deletePromises = cloudinaryPublicIds
      .filter((publicId) => !updatedPublicIds.includes(publicId))
      .map((publicId) => cloudinary.uploader.destroy(publicId));

    await Promise.all(deletePromises);

    const uploadPromises = updatedData.pictures
      .filter((pic) => typeof pic === "string")
      .map((base64Data) =>
        cloudinary.uploader.upload(base64Data, { folder: folderName })
      );

    const uploadedImages = await Promise.all(uploadPromises);
    const allImages = [
      ...updatedData.pictures.filter((pic) => typeof pic !== "string"),
      ...uploadedImages,
    ];

    updatedData.pictures = allImages;

    await program.update(updatedData);

    res.status(200).json({ message: "Program updated successfully", program });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update program", error: error.message });
  }
};

// Delete an program
exports.deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;

    const program = await Program.findByPk(id);
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    const { pictures } = program;
    // If there are pictures, proceed with deleting them from Cloudinary
    if (pictures && pictures.length > 0) {
      const folderName = pictures[0]?.folder;

      // Delete all pictures associated with the staff member
      const deletePromises = pictures.map((picture) =>
        cloudinary.uploader.destroy(picture.public_id)
      );
      await Promise.all(deletePromises);

      // Check if there are any remaining files in the folder and delete them
      const filesInFolder = await cloudinary.api.resources({
        type: "upload",
        prefix: folderName,
      });

      const deleteFilePromises = filesInFolder.resources.map((file) =>
        cloudinary.uploader.destroy(file.public_id)
      );

      await Promise.all(deleteFilePromises);

      // Finally, delete the folder itself
      await cloudinary.api.delete_folder(folderName);
    }
    await program.destroy();

    res.status(200).json({ message: "Program deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete program", error: error.message });
  }
};
