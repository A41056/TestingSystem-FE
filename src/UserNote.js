import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider';
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode function

function UserNote() {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const token = localStorage.getItem('token');

  // Decode the JWT token to extract user ID
  const decodedToken = jwtDecode(token);
  const { nameid: userId } = decodedToken;

  useEffect(() => {
    console.log("UserNote: Selected language changed to:", selectedLanguage);
  }, [selectedLanguage]);

  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/notes/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      } else {
        console.error('Failed to fetch notes:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleRemoveNote = async (noteId) => {
    try {
      const response = await fetch(`${BASE_URL}/user/note`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: noteId })
      });
      if (response.ok) {
        setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
      } else {
        console.error('Failed to remove note:', response.statusText);
      }
    } catch (error) {
      console.error('Error removing note:', error);
    }
  };

  const handleAddNote = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/note`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: userId, content: newNote })
      });
      if (response.ok) {
        // Refetch notes after adding a new note
        fetchNotes();
        setNewNote('');
      } else {
        console.error('Failed to add note:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  return (
    <div className="container site-section">
      <h2 className="my-4">{t('UserNotes')}</h2>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder={t('EnterNote')}
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAddNote}>{t('AddNote')}</button>
      </div>
      <ul className="list-group mt-3">
        {notes.map(note => (
          <li key={note.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{note.content}</span>
            <button className="btn btn-danger" onClick={() => handleRemoveNote(note.id)}>{t('Remove')}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserNote;