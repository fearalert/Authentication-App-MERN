const register = require("../Controllers/UserController");
const express = require('express');
const router = express.Router();

router.post("/register", register.register);

module.exports = router;