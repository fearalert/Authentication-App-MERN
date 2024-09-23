const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv").config();
const connection = require("./DBConnection/connection");
const userRoutes = require('./Routes/UserRoutes');

const app = express();

app.use(cors());

app.use(morgan("dev"));

app.use("/v1/user", userRoutes);


app.get("/", (req, res) => {
    res.json("Hello World!");
})
app.listen(process.env.PORT, async()=> {
    await connection()
    console.log(`Server is running on port ${process.env.PORT}`);
})