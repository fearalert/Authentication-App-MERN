const userController = require("../Controllers/UserController");
const express = require('express');
const router = express.Router();

router.post("/register", userController.register);
router.post("/verify-otp", userController.verify);
router.get("/reset-password", userController.verifyEmail);
router.post("/login", userController.login);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);

module.exports = router;