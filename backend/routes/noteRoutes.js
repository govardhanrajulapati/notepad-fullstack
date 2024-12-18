// File: noteRoutes.js
const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const authenticate = require('../auth');

// PUT to update a note by ID (if it belongs to the logged-in user)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      {
        title: req.body.title,
        content: req.body.content,
      },
      { new: true }
    );
    if (!updatedNote) return res.status(404).json({ error: 'Note not found' });
    res.json(updatedNote);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// DELETE a note by ID (if it belongs to the logged-in user)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!deletedNote) return res.status(404).json({ error: 'Note not found' });
    res.json({ message: 'Note deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// GET all notes (protected route)
router.get('/', authenticate, async (req, res) => {
    try {
      const notes = await Note.find({ userId: req.userId }); // Filter by userId
      res.json(notes);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch notes' });
    }
  });
  
  // POST a new note (protected route)
  router.post('/', authenticate, async (req, res) => {
    try {
      const newNote = new Note({
        title: req.body.title,
        content: req.body.content,
        userId: req.userId, // Associate note with logged-in user
      });
      await newNote.save();
      res.status(201).json(newNote);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create note' });
    }
  });

module.exports = router;