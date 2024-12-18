import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/LoginForm';
import Signup from './components/SignupForm';
import NoteForm from './components/NoteForm';
import NotesList from './components/NotesList';
import PrivateRoute from './components/PrivateRoute';
import './styles.css';
import './form.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/notelist"
            element={
              <PrivateRoute>
                <NotesList />
              </PrivateRoute>
            }
          />
          <Route
            path="/create"
            element={
              <PrivateRoute>
                <NoteForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <PrivateRoute>
                <NoteForm />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
