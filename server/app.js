require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const routes = require("./api/routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const sequelize = require("./api/config/database");
const compression = require("compression");

const app = express();

app.use(compression({ level: 9 }));

const options = {
  credentials: true,
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://admin.thepropshopworldwide.com",
    "http://localhost:8080",
  ],
};
app.use(cors(options));
app.use(
  bodyParser.urlencoded({
    extended: false,
    parameterLimit: 100000,
    limit: "500mb",
  })
);

app.use(express.json({ limit: "500mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use(morgan("dev"));

app.use("/", routes);

(async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("Database synchronized");
  } catch (error) {
    console.error("Unable to sync database:", error);
  }
})();

module.exports = app;
