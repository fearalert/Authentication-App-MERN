const bcrypt = require('bcryptjs');
const UserModel = require('../Models/UserSchema');
const otp_generator = require('otp-generator');

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
    const OTP_expires = Date.now() + 10 * 60 * 1000;

    // const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationToken = otp_generator.generate(6, {specialChars: true, upperCaseAlphabets: false})
    const verification_expires = Date;

    verification_expires.setMinutes(expires.getMinutes() + 5);

    const newUser = new UserModel({
      username,
      email,
      password: hashedPassword,
      OTP_VerificationToken: { OTP, expires: OTP_expires },
      verificationToken: { verification: verificationToken, expires: verification_expires }
    });

    await newUser.save();

    const message = `Your OTP is ${OTP}. It will expire in 10 minutes. \nOr use this verification link: http://localhost.com/verify/${verificationToken}`;
    await sendEmail(email, 'Account Verification', message);

    return res.status(201).json({
      message: 'User registered successfully. Please check your email for OTP or verification link.',
      data: { username, email },
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {register}
