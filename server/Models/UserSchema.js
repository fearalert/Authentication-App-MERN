const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: [8, 'Password must be at least 8 characters long'],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  OTP_VerificationToken: {
    OTP: String,
    expires: Date,
  },
  verificationToken: {
    verification: String,
    expires: Date,
  }
});

const UserModel = mongoose.model("Users", UserSchema);

module.exports = UserModel;
