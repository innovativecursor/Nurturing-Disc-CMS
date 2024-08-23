const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Enrollment = require("../models/enrollment");
const nodemailer = require("nodemailer");
const Joi = require("joi");

// Validations using JOI
const enrollmentSchema = Joi.object({
  enrollment_child_name: Joi.string().min(3).max(50).required(),
  enrollment_guardian_name: Joi.string().min(3).max(50).required(),
  enrollment_email_id: Joi.string().email().optional(),
  enrollment_phNumber: Joi.string().min(10).max(15).required(),
  enrollment_message: Joi.string().min(5).max(1000).optional(),
});
exports.fetchEnrollments = async (req, res) => {
  try {
    const fetch_enrollment = await Enrollment.findAll({});
    res.status(200).json(fetch_enrollment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to populate Inquiries", error: error.message });
  }
};
exports.createEnrollments = async (req, res) => {
  const { error } = enrollmentSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  try {
    const {
      enrollment_child_name,
      enrollment_guardian_name,
      enrollment_email_id,
      enrollment_phNumber,
      enrollment_message,
    } = req.body;
    const checkDuplicateEnrollment = await Enrollment.findAll({
      where: { enrollment_email_id },
    });
    if (checkDuplicateEnrollment.length != 0) {
      return res.status(400).json({
        message:
          "Duplicate Entry. An Enrollment with this email already exists.",
      });
    }
    await Enrollment.create({
      enrollment_child_name,
      enrollment_guardian_name,
      enrollment_email_id,
      enrollment_phNumber,
      enrollment_message,
    });
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      to: process.env.EMAIL,
      from: enrollment_email_id,
      subject: "Enrollment Form Inquiry",
      text: `
            You have received a new inquiry from the Proposhop International website.

            Details:
            Name: ${enrollment_guardian_name}
            Email: ${enrollment_email_id}
            Mobile Number: ${enrollment_phNumber}
        
            Message:
            ${enrollment_message}

            Please respond to the inquiry as soon as possible.
            `,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      message:
        "Thank you for showing your interest! We'll get back to you in 48 hours.",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong!", error: error.message });
  }
};
exports.deleteEnrollments = async (req, res) => {
  try {
    const { id } = req.params;
    const enrollment = await Enrollment.findByPk(id);
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    await enrollment.destroy();
    res.status(200).json({ message: "Enrollment Deleted Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to Delete Enrollment", error: error.message });
  }
};
