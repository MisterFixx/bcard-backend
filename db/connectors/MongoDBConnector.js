const mongoose = require("mongoose");
const chalk    = require("chalk");
const config   = require("config");
var mongodbUri = require('mongodb-uri');

const connectionString = config.get("CONNECTION_STRING");
const uriObject        = mongodbUri.parse(connectionString);

mongoose.connect(connectionString)
    .then(() => {
        console.log(chalk.magentaBright(`Connected to MongoDB on ${uriObject.hosts[0].host}:${uriObject.hosts[0].port}!`)); 
    })
    .catch((error) =>
        console.log(chalk.redBright.bold(`Could not connect to MongoDB on ${uriObject.hosts[0].host}:${uriObject.hosts[0].port}: ${error}`))
    );