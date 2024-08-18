// controllers/userController.js

const cloudinary = require("../../utils/cloudinary");

exports.getGallery = async (req, res) => {
  try {
    const folderName = `${process.env.CLOUDINARY_DB}/Gallery`;

    // Fetch all images from the specified folder in Cloudinary
    let allImages = [];
    let nextCursor = null;
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: folderName,
      max_results: 500, // Adjust as needed
      next_cursor: nextCursor,
    });
    // Format the fetched images to include only 'url', 'secure_url', and 'public_id'
    const formattedImages = result?.resources?.map((image) => ({
      url: image.url,
      secure_url: image.secure_url,
      public_id: image.public_id,
    }));
    res.status(200).json(formattedImages);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch Images", error: error.message });
  }
};
exports.updateGallery = async (req, res) => {
  try {
    const { pictures } = req.body;

    const folderName = `${process.env.CLOUDINARY_DB}/Gallery`;
    // Upload pictures to Cloudinary
    const uploadPromises = pictures?.map((base64Data) => {
      return cloudinary.uploader.upload(base64Data, {
        folder: folderName, // Specify the folder for uploaded images
      });
    });

    const uploadedImages = await Promise.all(uploadPromises);
    res.status(201).json({ message: "Image Pushed Successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to Upload Images", error: error.message });
  }
};
// Delete an Image
exports.deleteGallery = async (req, res) => {
  try {
    // Extract the public_id from the request parameters
    const publicId = req.params.public_id;

    // Delete the image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);

    // Check if the deletion was successful
    if (result.result === "ok") {
      res.status(200).json({ message: "Image Deleted Successfully" });
    } else {
      res.status(400).json({ message: "Failed to delete Image" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete Image", error: error.message });
  }
};
