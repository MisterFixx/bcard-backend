const config = require("config");

const connectToDb = () => {
    if(config.get("DB") === "MONGODB"){
        require("./connectors/MongoDBConnector.js");
    }
    else{
        // Other database implementations can go here
    }
};

module.exports = connectToDb;