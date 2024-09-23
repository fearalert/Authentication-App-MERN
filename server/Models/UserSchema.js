const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
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

// UserSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }
//   this.password = await bcrypt.hash(this.password, 10);
//   next();
// });

// UserSchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// UserSchema.methods.getJWTToken = function () {
//   return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRE,
//   });
// };

// userSchema.methods.getResetPasswordToken = function () {
//   const resetToken = bcrypt.genSaltSync(10);
//   this.resetPasswordToken = resetToken;
//   this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

//   return resetToken;
// };


export const User = mongoose.model("User", UserSchema);

modules.export = User;