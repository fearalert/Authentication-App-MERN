const mongoose = require("mongoose");

const connection = () => {
    mongoose.connect(process.env.DB_URI, {
        dbName: "Authentication_APP"
    }).then(()=>{
        console.log("Connected to MongoDB");
    }).catch(err=>{
        console.log(`Error while connecting MongoDB ${err}`);
    })      
}

module.exports = connection;