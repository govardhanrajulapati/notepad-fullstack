// File: server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const noteRoutes = require('./routes/noteRoutes');
const userRoutes = require('./routes/userRoutes'); // Add this


const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/notes', noteRoutes);
app.use('/api/users', userRoutes); // Add user-related routes


// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));