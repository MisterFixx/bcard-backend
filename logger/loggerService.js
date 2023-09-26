const express      = require("express");
const app          = express();
const config       = require("config");
const morganLogger = require("./loggers/morgan.js");

const LOGGER = config.get("LOGGER");

if (LOGGER === "morgan") app.use(morganLogger);

module.exports = app;