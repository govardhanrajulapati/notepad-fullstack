const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('./emailService');
require('dotenv').config();

const router = express.Router();

const generateOTP = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const otp = generateOTP();
    await sendVerificationEmail(email, otp);
    res
      .status(200)
      .json({ message: 'Login successful. OTP sent to email', otpSent: true, email, tempOTP: otp });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.post('/verify-otp', async (req, res) => {
  const { email, otp, tempOTP } = req.body;
  try {
    if (tempOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    const user = await User.findOne({ email });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'OTP verified successfully', token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP' });
  }
});

module.exports = router;