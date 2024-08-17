const Testimonial = require("../models/testimonials");
const cloudinary = require("../../utils/cloudinary");
const Joi = require("joi");
const { formattedResult } = require("../utils/Consts");

// Define Joi schema
const testimonialSchema = Joi.object({
  reviewer_name: Joi.string().allow(null, ""), // Allows empty strings or null values
  review: Joi.string().required(),
  pictures: Joi.array().items(Joi.string().uri()).required(), // Assuming pictures are an array of URLs
});
exports.getTestimonials = async (req, res) => {
  const testimonialsFetched = await Testimonial.findAll({});
  const result = formattedResult(testimonialsFetched);
  res.status(200).json(result);
};
exports.createTestimonial = async (req, res) => {
  // Validate request data against the schema
  const { error } = testimonialSchema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json({ message: "Validation Error", error: error.details[0].message });
  }
  try {
    const { company_name, reviewer_name, review, pictures } = req.body;
    const creation = await Testimonial.create({
      company_name,
      reviewer_name,
      review,
      pictures: [],
    });
    // Generate a unique folder name using the testimonial
    const folderName = `${process.env.CLOUDINARY_DB}/testimonial${creation.testimonial_id}`;

    // Upload pictures to Cloudinary
    const uploadPromises = pictures?.map((base64Data) => {
      return cloudinary.uploader.upload(base64Data, {
        folder: folderName, // Specify the folder for uploaded images
      });
    });

    const uploadedImages = await Promise.all(uploadPromises);

    // Update the testimonial with the uploaded images
    await creation.update({ pictures: uploadedImages });
    res.status(200).json({ message: "Created Testimonial Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to Create Testimonial", error: error.message });
  }
};
exports.deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findByPk(id);
    if (!testimonial) {
      return res.status(404).json({ message: "testimonial not found" });
    }

    // Extract the pictures array from the testimonial
    const { pictures } = testimonial;
    // Extract the folder name from the first picture URL (assuming they all belong to the same folder)
    const folderName = pictures[0].folder;
    // Create a list of promises to delete each image from Cloudinary
    const deletePromises = pictures.map((picture) => {
      // Extract the public_id from the picture URL
      const publicId = picture.public_id;
      return cloudinary.uploader.destroy(publicId);
    });

    // Wait for all images to be deleted from Cloudinary
    await Promise.all(deletePromises);

    // Get a list of all files within the folder
    const filesInFolder = await cloudinary.api.resources({
      type: "upload",
      prefix: folderName,
    });

    // Create a list of promises to delete each file within the folder
    const deleteFilePromises = filesInFolder.resources.map((file) => {
      return cloudinary.uploader.destroy(file.public_id);
    });

    // Wait for all files to be deleted from Cloudinary
    await Promise.all(deleteFilePromises);

    // Delete the folder in Cloudinary
    await cloudinary.api.delete_folder(folderName);

    // Delete the testimonial from the database
    await testimonial.destroy();

    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete testimonial", error: error.message });
  }
};
