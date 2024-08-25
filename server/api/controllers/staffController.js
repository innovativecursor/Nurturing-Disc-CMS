const Joi = require("joi");
const cloudinary = require("../../utils/cloudinary");
const Staff = require("../models/staff");
const { formattedResult } = require("../utils/Consts");
const {
  universalDeletefn,
} = require("./UniversalControllerFunctions/universalController");

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
// exports.postStaff = async (req, res) => {
//   // Validate the incoming request data
//   const { error } = validateStaff(req.body);
//   if (error) {
//     return res.status(400).json({
//       message: "Please Fill in all the Fields",
//       error: error.details[0].message,
//     });
//   }

//   try {
//     const { staff_name, staff_position, staff_featured, pictures } = req.body;

//     // Create the event in the database
//     const staff = await Staff.create({
//       staff_name,
//       staff_position,
//       staff_featured,
//       pictures: [],
//     });

//     const folderName = `${process.env.CLOUDINARY_DB}/staff_${staff.staff_id}`;

//     // Upload pictures to Cloudinary
//     const uploadPromises = pictures?.map((base64Data) => {
//       return cloudinary.uploader.upload(base64Data, {
//         folder: folderName,
//       });
//     });

//     const uploadedImages = await Promise.all(uploadPromises);

//     // Update the staff with the uploaded images
//     await staff.update({ pictures: uploadedImages });

//     res.status(201).json({ message: "Staff created successfully", staff });
//   } catch (error) {
//     res.status(500).json({ message: error.message, error: error.message });
//   }
// };
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

    const folderName = `${
      process.env.CLOUDINARY_DB
    }/staff_${new Date().toISOString()}`;

    // Upload pictures to Cloudinary
    const uploadPromises = pictures?.map((base64Data) => {
      return cloudinary.uploader.upload(base64Data, {
        folder: folderName,
      });
    });

    // Wait for all images to be uploaded
    const uploadedImages = await Promise.all(uploadPromises);

    // Check if any image upload failed
    if (!uploadedImages || uploadedImages.length !== pictures.length) {
      return res
        .status(400)
        .json({ message: "Failed to upload one or more images to Cloudinary" });
    }

    // Create the staff record only after successful uploads
    const staff = await Staff.create({
      staff_name,
      staff_position,
      staff_featured,
      pictures: uploadedImages.map((img) => {
        return {
          url: img.url,
          secure_url: img.secure_url,
          public_id: img.public_id,
          folder: img.folder,
        };
      }),
    });

    res.status(201).json({ message: "Staff created successfully", staff });
  } catch (error) {
    res.status(500).json({ message: error.message, error: error.message });
  }
};
// Delete an staff
// exports.deleteStaff = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const staff = await Staff.findByPk(id);
//     if (!staff) {
//       return res.status(404).json({ message: "Staff not found" });
//     }

//     const { pictures } = staff;
//     //To check if the picture exists??
//     if (pictures.length != 0) {
//       const folderName = pictures[0]?.folder;

//       const deletePromises = pictures.map((picture) =>
//         cloudinary.uploader.destroy(picture.public_id)
//       );
//       await Promise.all(deletePromises);

//       const filesInFolder = await cloudinary.api.resources({
//         type: "upload",
//         prefix: folderName,
//       });

//       const deleteFilePromises = filesInFolder.resources.map((file) =>
//         cloudinary.uploader.destroy(file.public_id)
//       );

//       await Promise.all(deleteFilePromises);

//       await cloudinary.api.delete_folder(folderName);
//     } else {
//     }
//     await staff.destroy();

//     res.status(200).json({ message: "staff deleted successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to delete staff", error: error.message });
//   }
// };
exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the staff record by primary key (id)
    const staff = await Staff.findByPk(id);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    const { pictures } = staff;

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

    // Delete the staff record from the database
    await staff.destroy();

    res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete staff", error: error.message });
  }
};
