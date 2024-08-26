const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { v4: uuidv4 } = require("uuid");

const Staff = sequelize.define(
  "Staff",
  {
    staff_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    staff_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    staff_featured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    staff_position: {
      type: DataTypes.STRING,
    },
    pictures: { type: DataTypes.JSON, allowNull: false },
  },
  {
    hooks: {
      beforeCreate: (staff) => {
        staff.staff_id = uuidv4();
      },
    },
  }
);
module.exports = Staff;
