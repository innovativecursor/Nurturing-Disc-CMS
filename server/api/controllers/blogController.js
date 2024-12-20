const Joi = require("joi");
const cloudinary = require("../../utils/cloudinary");
const Blog = require("../models/blog");
const { formattedDatePicResult } = require("../utils/Consts");

// Joi validation schema
const validateBlog = (blog) => {
  const schema = Joi.object({
    blog_title: Joi.string().required(),
    blog_content: Joi.string().required(),
    date: Joi.date().iso().required(), // Validate ISO 8601 date format
    pictures: Joi.any().required(),
  });

  return schema.validate(blog);
};

// Get all blogs
exports.getBlogs = async (req, res) => {
  try {
    const blog = await Blog.findAll({});
    const result = formattedDatePicResult(blog);
    // Format the fetched images to include transformed 'secure_url'
    result?.map((image) => {
      return {
        ...result,
        url: cloudinary.url(image?.public_id, {
          transformation: [
            { width: 100, height: 100, crop: "limit", quality: "auto" },
            { fetch_format: "webp" }, // Convert to WebP format
          ],
        }),
      };
    });
    console.log("result", result);
    // res.status(200).json(formattedImages);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch blogs", error: error.message });
  }
};

// Post a new Blog
exports.postBlogs = async (req, res) => {
  // Validate the incoming request data
  const { error } = validateBlog(req.body);
  if (error) {
    return res.status(400).json({
      message: "Please Fill in all the Fields",
      error: error.details[0].message,
    });
  }
  try {
    const { blog_title, blog_content, date, pictures } = req.body;
    const folderName = `${
      process.env.CLOUDINARY_DB
    }/blog_${new Date().toISOString()}`;

    // Upload pictures to Cloudinary
    const uploadPromises = req.body?.pictures?.map((base64Data) => {
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
    // Create the blog in the database
    const blog = await Blog.create({
      blog_title,
      blog_content,
      date,
      pictures: [],
    });
    // Update the blog with the uploaded images
    await blog.update({ pictures: uploadedImages });

    res.status(201).json({ message: "Blog created successfully", blog });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create blog", error: error.message });
  }
};

// Update an existing blog
exports.updateBlogs = async (req, res) => {
  const { id } = req.params;

  // Validate the incoming request data
  //   const { error } = validateBlog(req.body);
  //   if (error) {
  //     return res.status(400).json({
  //       message: "Please Fill in all the Fields",
  //       error: error.details[0].message,
  //     });
  //   }

  try {
    const updatedData = req.body;

    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const folderName = `${process.env.CLOUDINARY_DB}/blog_${id}`;

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

    await blog.update(updatedData);

    res.status(200).json({ message: "Blog updated successfully", blog });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update Blog", error: error.message });
  }
};

// Delete an blog
// exports.deleteBlogs = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const blog = await Blog.findByPk(id);
//     if (!blog) {
//       return res.status(404).json({ message: "Blog not found" });
//     }

//     const { pictures } = blog;
//     const folderName = pictures[0]?.public_id;

//     const deletePromises = pictures.map((picture) =>
//       cloudinary.uploader.destroy(picture.public_id)
//     );
//     await Promise.all(deletePromises);

//     const filesInFolder = await cloudinary.api.resources({
//       type: "upload",
//       prefix: folderName,
//     });

//     const deleteFilePromises = filesInFolder.resources.map((file) =>
//       cloudinary.uploader.destroy(file.public_id)
//     );

//     await Promise.all(deleteFilePromises);

//     await cloudinary.api.delete_folder(folderName);
//     await blog.destroy();

//     res.status(200).json({ message: "Blog deleted successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Failed to delete blog", error: error.message });
//   }
// };
exports.deleteBlogs = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ message: "blog not found" });
    }

    const { pictures } = blog;
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
    await blog.destroy();

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete Blog", error: error.message });
  }
};
