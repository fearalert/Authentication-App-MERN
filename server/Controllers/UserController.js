const bcrypt = require('bcryptjs');
const UserModel = require('../models/UserSchema');
const otp_generator = require('otp-generator');
const SendEmail = require('../utils/SendEmail');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const OTP = Math.floor(100000 + Math.random() * 900000).toString();
    const OTP_expires = new Date();
    OTP_expires.setMinutes(OTP_expires.getMinutes() + 5);

    const verificationToken = otp_generator.generate(6, { specialChars: true, upperCaseAlphabets: false });
    const verification_expires = new Date();
    verification_expires.setMinutes(verification_expires.getMinutes() + 5);

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      OTP_VerificationToken: { OTP, expires: OTP_expires },
      verificationToken: { token: verificationToken, expires: verification_expires }
    });

    await newUser.save();
    const verificationLink = `http://localhost:4000/v1/users/verify-email?token=${verificationToken}&email=${encodeURIComponent(email)}`;
    const message = `Your OTP is ${OTP}. It will expire in 10 minutes. \nOr use this verification link: ${verificationLink}`;
    await SendEmail(email, 'Account Verification', message);

    return res.status(201).json({
      message: 'User registered successfully. Please check your email for OTP or verification link.',
      data: { username, email },
    });
  } catch (error) {
    console.error("Error in register API:", error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, OTP } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (user.OTP_VerificationToken.OTP === OTP && user.OTP_VerificationToken.expires > Date.now()) {
      user.isVerified = true;
      user.OTP_VerificationToken = {};
      await user.save();

      return res.json({ message: 'User verified successfully' });
    } else {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
  } catch (error) {
    console.error("Error in verify OTP API:", error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token, email } = req.query;

    if (!token || !email) {
      return res.status(400).json({ message: 'Invalid verification link.' });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (
      !user.verificationToken ||
      user.verificationToken.token !== token ||
      user.verificationToken.expires < new Date()
    ) {
      return res.status(400).json({ message: 'Invalid or expired verification link.' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return res.status(200).json({ message: 'Email successfully verified.' });
  } catch (error) {
    console.error("Error in email verification API:", error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const login = async (req, res) => {
  try {
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email }).select('+password');
      if (!user) {
          return res.status(400).json({ message: 'Invalid email address' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ message: 'Invalid password' });
      }

      if (!user.isVerified) {
          return res.status(403).json({ message: 'User is not verified' });
      }

      const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
      const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

      // Store refresh token in the database
      user.refreshToken = refreshToken;
      await user.save();

      // Set refresh token as a cookie
      res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({ accessToken, message: 'Login successful' });
  } catch (error) {
      console.error("Error in login API:", error);
      return res.status(500).json({ message: 'Server error', error });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) return res.sendStatus(401); // Unauthorized

  const user = await UserModel.findOne({ refreshToken });
  if (!user) return res.sendStatus(403); // Forbidden

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403); // Forbidden

      const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

      res.json({ accessToken: newAccessToken });
  });
};

const logout = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.sendStatus(204);

  const user = await UserModel.findOne({ refreshToken });
  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.status(204).send();
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    const OTP = Math.floor(100000 + Math.random() * 900000).toString();
    const OTP_expires = new Date();
    OTP_expires.setMinutes(OTP_expires.getMinutes() + 5);

    user.verificationToken = { verification: OTP, expires: OTP_expires };
    await user.save();

    const message = `Use this verification token to proceed to reset your password: ${OTP}`;
    await SendEmail(email, 'Password Reset', message);

    return res.status(200).json({
      message: 'Password reset email sent. Please check your email for further instructions.',
    });
  } catch (error) {
    console.error("Error in forgot password API:", error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, verificationToken, newPassword } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email not found' });
    }

    if (user.verificationToken.verification !== verificationToken || Date.now() > user.verificationToken.expires) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.verificationToken = {};
    await user.save();

    return res.status(200).json({ message: 'Password successfully reset.' });
  } catch (error) {
    console.error("Error in reset password API:", error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  register,
  verifyOTP,
  verifyEmail,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
};
