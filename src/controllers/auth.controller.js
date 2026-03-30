const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const generateOTP = require("../utils/generateOTP");

// ---------------- SIGNUP ----------------
exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({ message: "Signup successful" });
};

// ---------------- LOGIN ----------------
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token, user });
};

// ---------------- FORGOT PASSWORD ----------------
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const otp = generateOTP();

  user.resetOTP = otp;
  user.resetOTPExpiry = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendEmail(
    email,
    "Password Reset OTP",
    `Your OTP is ${otp}`
  );

  res.json({ message: "OTP sent to registered email" });
};

// ---------------- VERIFY OTP ----------------
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (
    !user ||
    user.resetOTP !== otp ||
    user.resetOTPExpiry < Date.now()
  ) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  res.json({ message: "OTP verified successfully" });
};

// ---------------- RESET PASSWORD ----------------
exports.resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  const user = await User.findOne({ email });

  user.password = newPassword;
  user.resetOTP = null;
  user.resetOTPExpiry = null;

  await user.save();

  res.json({ message: "Password reset successful" });
};
