// File: auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Add userId to request object
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticateUser;