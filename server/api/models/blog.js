const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Blog = sequelize.define("Blog", {
  blog_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  blog_title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  blog_content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  pictures: { type: DataTypes.JSON, allowNull: false },
});

module.exports = Blog;
