const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv").config();
const connection = require("./DBConnection/connection");
const userRoutes = require('./Routes/UserRoutes');

const app = express();

app.use(express.json());

app.use(cors("http://localhost:5173"));

app.use(morgan("dev"));

app.use("/v1/users", userRoutes);


app.get("/", (req, res) => {
    res.json("Hello World!");
})
app.listen(process.env.PORT, async()=> {
    await connection()
    console.log(`Server is running on port ${process.env.PORT}`);
})