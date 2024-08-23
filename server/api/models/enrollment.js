const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Enrollment = sequelize.define("Enrollment", {
  enrollment_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  enrollment_child_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  enrollment_guardian_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  enrollment_email_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  enrollment_phNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  enrollment_message: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Enrollment;
