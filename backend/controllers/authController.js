const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const sendEmail = require('../utils/sendEmail');

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });

const publicUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  phone: user.phone,
  role: user.role,
  avatar: user.avatar,
  createdAt: user.createdAt
});

exports.register = async (req, res) => {
  const { fullName, email, password, phone, role } = req.body;
  const safeRole = ['patient', 'doctor'].includes(role) ? role : 'patient';
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email already registered' });

  const user = await User.create({ fullName, email, password, phone, role: safeRole });
  if (safeRole === 'doctor') await Doctor.create({ userId: user._id });

  res.status(201).json({ token: signToken(user), user: publicUser(user) });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  res.json({ token: signToken(user), user: publicUser(user) });
};

exports.forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.json({ message: 'If that email exists, a reset link has been sent' });

  const rawToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/auth/reset-password/${rawToken}`;
  await sendEmail({
    to: user.email,
    subject: 'Reset your Doctor Hub password',
    html: `<p>Use this link to reset your Doctor Hub password:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
  });
  res.json({ message: 'Password reset email sent' });
};

exports.resetPassword = async (req, res) => {
  const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() }
  });
  if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  res.json({ token: signToken(user), user: publicUser(user) });
};
