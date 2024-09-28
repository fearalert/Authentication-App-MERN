const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv").config();
const connection = require("./DBConnection/connection");
const userRoutes = require('./Routes/UserRoutes');
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(morgan("dev"));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        },
        store: MongoStore.create({
            mongoUrl: process.env.DB_URI,
            collectionName: "sessions",
            ttl: 60 * 60,
        }),
    })
);

app.use("/v1/users", userRoutes);

app.listen(process.env.PORT, async () => {
    await connection();
    console.log(`Server is running on port ${process.env.PORT}`);
});
