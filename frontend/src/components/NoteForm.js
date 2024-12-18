import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './noteform.css';

function NoteForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:5000/api/notes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setTitle(response.data.title);
          setContent(response.data.content);
        })
        .catch((error) => console.error('Error fetching the note:', error));
    }
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      if (id) {
        await axios.put(`http://localhost:5000/api/notes/${id}`, { title, content }, { headers });
      } else {
        await axios.post('http://localhost:5000/api/notes', { title, content }, { headers });
      }
      navigate('/notelist');
    } catch (error) {
      console.error('Error saving the note:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="note-form-container">
      <h1>{id ? 'Edit Note' : 'Create Note'}</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit">Save</button>
    </form>
  );
}

export default NoteForm;