const userController = require("../Controllers/UserController");
const express = require('express');
const router = express.Router();

router.post("/register", userController.register);
router.post("/verify-otp", userController.verifyOTP);
router.get("/verify-email", userController.verifyEmail);
router.post("/login", userController.login);
router.post("/forgot-password", userController.forgotPassword);
router.post("/reset-password", userController.resetPassword);
router.post("/refresh-token", userController.refreshToken);

module.exports = router;