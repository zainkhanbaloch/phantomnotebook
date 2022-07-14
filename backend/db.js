const mongoose = require("mongoose");
mongoURI = "mongodb://localhost:27017/iNotebook";

const connectToMongo = ()=>{
    mongoose.connect(mongoURI,()=>{
        console.log("Successfull: Connected To Mongo")
    });
};

module.exports = connectToMongo;