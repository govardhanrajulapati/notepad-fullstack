// File: Note.js
const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Note', NoteSchema);