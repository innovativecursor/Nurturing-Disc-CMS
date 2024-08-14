// routes/index.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const eventController = require("../controllers/eventController");
const galleryController = require("../controllers/galleryController");
const inquiryController = require("../controllers/inquiryController");
const testimonialController = require("../controllers/testimonialController");
const authenticateUser = require("../middleware/authenticateUser");
const { apiLimiter } = require("../middleware/apiLimiter");

// User routes
router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/forgotPassword", userController.forgotPassword);
router.post("/resetPassword", userController.resetPassword);
router.get("/users", authenticateUser, userController.allUsers);

// Gallery routes
router.get("/fetchGallery", galleryController.getGallery);
router.post(
  "/updateGallery",
  authenticateUser,
  galleryController.updateGallery
);
router.delete(
  "/gallery/:public_id(*)",
  authenticateUser,
  galleryController.deleteGallery
);

// Inquiry Routes
router.get(
  "/fetchInquiries",
  authenticateUser,
  inquiryController.fetchInquiries
);
router.post("/sendInquiry", apiLimiter, inquiryController.createInquiry);
router.delete(
  "/deleteInquiry/:id",
  authenticateUser,
  inquiryController.deleteInquiry
);
// Testimonials
router.get("/fetchTestimonials", testimonialController.getTestimonials);
router.post(
  "/createTestimonial",
  authenticateUser,
  testimonialController.createTestimonial
);
router.delete(
  "/deleteTestimonial/:id",
  authenticateUser,
  testimonialController.deleteTestimonial
);
// Events route
router.get("/fetchEvents", eventController.getEvents);
router.post("/postEvents", authenticateUser, eventController.postEvents);
router.put("/updateEvent/:id", authenticateUser, eventController.updateEvents);
router.delete(
  "/deleteEvents/:id",
  authenticateUser,
  eventController.deleteEvents
);
module.exports = router;
