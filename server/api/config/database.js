// module.exports = sequelize;
const { Sequelize } = require("sequelize");

// Initialize Sequelize with a temporary connection to create the database
const sequelize = new Sequelize("NurturingDiscoveries", "root", "root", {
  dialect: "mysql",
  host: "localhost",
});

// Function to create the database if it doesn't exist
const createDatabase = async () => {
  try {
    await sequelize.query(
      "CREATE DATABASE IF NOT EXISTS `NurturingDiscoveries`;"
    );
    console.log(
      "Database 'NurturingDiscoveries' has been created or already exists."
    );
  } catch (error) {
    console.error("Error creating the database:", error);
  }
};

// Initialize Sequelize with the actual database
const initSequelize = async () => {
  // First, create the database if it doesn't exist
  await createDatabase();

  // Now, initialize Sequelize with the actual database
  const sequelizeWithDB = new Sequelize(
    "NurturingDiscoveries",
    "root",
    "root",
    {
      dialect: "mysql",
      host: "localhost",
    }
  );

  // Test the database connection
  try {
    await sequelizeWithDB.authenticate();
    console.log("Database connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  return sequelizeWithDB;
};

// Call the function to initialize Sequelize
initSequelize();

module.exports = sequelize;
