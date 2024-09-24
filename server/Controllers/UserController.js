const bcrypt = require('bcryptjs');
const UserModel = require('../Models/UserSchema');
const otp_generator = require('otp-generator');
const SendEmail = require('../Utils/SendEmail');
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

    console.log("Token", verificationToken);
    console.log("OTP", OTP);

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      OTP_VerificationToken: { OTP, expires: OTP_expires },
      verificationToken: { token: verificationToken, expires: verification_expires }
    });

    await newUser.save();

    const message = `Your OTP is ${OTP}. It will expire in 10 minutes. \nOr use this verification link: http://localhost:4000.com/v1/users/verify/${verificationToken}`;
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


const verify = async (req, res) => {
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
  const { token, email } = req.query;

  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  if (
    user.verificationToken.verification === token &&
    user.verificationToken.expires > Date.now()
  ) {
    user.isVerified = true;
    user.verificationToken = {};
    await user.save();

    return res.json({ message: 'Email verified successfully!' });
  } else {
    return res.status(400).json({ message: 'Invalid or expired verification token' });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'User is not verified' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, message: 'Login successful' });
  } catch (error) {
    console.error("Error in login API:", error);
    return res.status(500).json({ message: 'Server error', error });
  }
};

const verifyJWTToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized!' });
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = { register, verify, login, verifyJWTToken, verifyEmail };

