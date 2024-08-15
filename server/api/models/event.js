const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Event = sequelize.define("Event", {
  event_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  event_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  event_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  event_location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  event_description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pictures: { type: DataTypes.JSON, allowNull: false },
});

module.exports = Event;
