const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Program = sequelize.define("Program", {
  program_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  program_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  min_age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  max_age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  program_description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  pictures: { type: DataTypes.JSON, allowNull: false },
});

module.exports = Program;
