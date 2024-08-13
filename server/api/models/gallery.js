const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const Gallery = sequelize.define("Gallery", {
  pictures: { type: DataTypes.JSON, allowNull: false },
});
module.exports = Gallery;
