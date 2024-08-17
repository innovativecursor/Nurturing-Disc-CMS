const Joi = require("joi");
const cloudinary = require("../../utils/cloudinary");
const Event = require("../models/event");
const { formattedDatePicResult } = require("../utils/Consts");

// Joi validation schema
const validateEvent = (event) => {
  const schema = Joi.object({
    event_name: Joi.string().required(),
    date: Joi.date().iso().required(), // Validate ISO 8601 date format
    event_location: Joi.string().required(),
    event_description: Joi.string().required(),
    pictures: Joi.any().required(),
  });

  return schema.validate(event);
};

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.findAll({});
    const result = formattedDatePicResult(events);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch events", error: error.message });
  }
};

// Post a new event
exports.postEvents = async (req, res) => {
  // Validate the incoming request data
  const { error } = validateEvent(req.body);
  if (error) {
    return res.status(400).json({
      message: "Please Fill in all the Fields",
      error: error.details[0].message,
    });
  }

  try {
    const { event_name, date, event_location, event_description, pictures } =
      req.body;

    // Create the event in the database
    const event = await Event.create({
      event_name,
      date,
      event_location,
      event_description,
      pictures: [],
    });

    const folderName = `${process.env.CLOUDINARY_DB}/event_${event.event_id}`;

    // Upload pictures to Cloudinary
    const uploadPromises = pictures?.map((base64Data) => {
      return cloudinary.uploader.upload(base64Data, {
        folder: folderName,
      });
    });

    const uploadedImages = await Promise.all(uploadPromises);

    // Update the event with the uploaded images
    await event.update({ pictures: uploadedImages });

    res.status(201).json({ message: "Event created successfully", event });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create event", error: error.message });
  }
};

// Update an existing event
exports.updateEvents = async (req, res) => {
  const { id } = req.params;

  // Validate the incoming request data
  //   const { error } = validateEvent(req.body);
  //   if (error) {
  //     return res.status(400).json({
  //       message: "Please Fill in all the Fields",
  //       error: error.details[0].message,
  //     });
  //   }

  try {
    const updatedData = req.body;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const folderName = `${process.env.CLOUDINARY_DB}/event_${id}`;

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

    await event.update(updatedData);

    res.status(200).json({ message: "Event updated successfully", event });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update event", error: error.message });
  }
};

// Delete an event
exports.deleteEvents = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const { pictures } = event;
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
    await event.destroy();

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete event", error: error.message });
  }
};
