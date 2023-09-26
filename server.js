const chalk   = require("chalk");
const express = require("express");
const config  = require("config");
const cors    = require("cors");
const connectToDb = require("./db/dbService");
const loggerService = require("./logger/loggerService");
const { getUserByEmail } = require("./users/models/userDataService")
const { generateInitialCards, generateInitialUsers } = require("./initialData/initialDataService");
const cardsRestController = require("./cards/restController");
const usersRestController = require("./users/restController");

const app    = express();
const router = express.Router();
const PORT   = config.get("PORT");

app.use(express.json());
app.use(loggerService);
app.use(
    cors({
        origin: ["http://127.0.0.1:5500", "http://localhost:3000", "*"],
        optionsSuccessStatus: 200,
    })
);

router.use("/cards", cardsRestController);
router.use("/users", usersRestController);

router.use("/", (req, res) => {
    res.send("Welcome to the REST API of the Cards App");
});

router.use((req, res) => {
    handleError(res, 404, "Page not found!");
});

app.use(router);

app.use((err, req, res, next) => {
    handleError(res, 500, err.message);
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(chalk.blueBright(`Listening on: http://localhost:${PORT}`));
    connectToDb();

    //Check if this is the first time the server runs.
    getUserByEmail("regular@gmail.com").catch((reason) => {
        if(reason == "Error: User not found"){
            console.log(chalk.cyan("First time run detected! generating initial data..."));

            generateInitialCards();
            generateInitialUsers();
        }
    });
});