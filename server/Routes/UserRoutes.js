const userController = require("../Controllers/UserController");
const express = require('express');
const router = express.Router();

router.post("/register", userController.register);
router.get("/verify-otp", userController.verify);
router.get("/verify-jwt", userController.verifyJWTToken);
router.post("/login", userController.login);
router.get("/verify-email", userController.verifyEmail);

module.exports = router;