import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Trash2, Edit2, Plus, Check, X, Search, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './notelist.css';

function NotesList() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchNotes = useCallback(() => {
    if (!token) return;

    axios
      .get('https://notepad-fullstack.onrender.com/api/notes', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setNotes(response.data))
      .catch((error) => {
        console.error('Error fetching notes:', error);
      });
  }, [token]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleFormReset = () => {
    setTitle('');
    setContent('');
    setEditingNoteId(null);
    setIsFormVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      if (editingNoteId) {
        await axios.put(`https://notepad-fullstack.onrender.com/api/notes/${editingNoteId}`, { title, content }, { headers });
      } else {
        await axios.post('https://notepad-fullstack.onrender.com/api/notes', { title, content }, { headers });
      }
      
      handleFormReset();
      fetchNotes();
    } catch (error) {
      console.error('Error saving the note:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.delete(`https://notepad-fullstack.onrender.com/api/notes/${id}`, { headers });
      setNotes(notes.filter((note) => note._id !== id));
    } catch (error) {
      console.error('Error deleting the note:', error);
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingNoteId(note._id);
    setIsFormVisible(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Filter notes based on search term
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="notes-list-container dark-theme">
      <div className="notes-header">
        <h1>My Notes</h1>
        <div className="search-and-new-wrapper">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <Search className="search-icon" />
          </div>
          <button
            className="add-note-btn"
            onClick={() => setIsFormVisible(!isFormVisible)}
          >
            {isFormVisible ? 'Cancel' : 'New Note'} {isFormVisible ? <X /> : <Plus size={20} />}
          </button>
        </div>
        <div className="logout-btn-wrapper">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {isFormVisible && (
        <div className='note-form-container'>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <div className="form-actions">
              <button type="submit" className="save-btn">
                <Check /> Save
              </button>
              <button type='button' onClick={handleFormReset} className="cancel-btn">
                <X /> Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {filteredNotes.length === 0 ? (
        <div className="empty-state">
          <p>No notes found. Create your first note!</p>
        </div>
      ) : (
        <ul className="notes-grid">
          {filteredNotes.map((note) => (
            <li key={note._id} className="note-card">
              <div className="note-content">
                <h2>{note.title}</h2>
                <p>{note.content}</p>
              </div>
              <div className="note-actions">
                <button onClick={() => handleEdit(note)} className="edit-btn">
                  <Edit2 size={16} /> Edit
                </button>
                <button onClick={() => handleDelete(note._id)} className="delete-btn">
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NotesList;
