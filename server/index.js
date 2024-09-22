const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv").config();
const connection = require("./DBConnection/connection.js");


const app = express();

app.use(cors());

app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.json("Hello World!");
})
app.listen(process.env.PORT, async()=> {
    await connection()
    console.log(`Server is running on port ${process.env.PORT}`);
})