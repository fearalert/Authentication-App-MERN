const bcrypt = require('bcryptjs');
const UserModel = require('../Models/UserSchema');
const otp_generator = require('otp-generator');
const SendEmail = require('../Utils/SendEmail');

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

module.exports = { register };
