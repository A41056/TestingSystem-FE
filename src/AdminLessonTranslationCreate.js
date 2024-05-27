import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminLessonTranslationCreate() {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();

  useEffect(() => {
  }, [selectedLanguage]);
    const { courseId, lessonId } = useParams(); // Get the category ID from the URL params
    const [lessonTitle, setLessonName] = useState('');
    const [formData, setFormData] = useState({
      title: '',
      content: '',
      languageCode: 'en', // Default language code is 'en' (English)
    });
    const [languageList, setLanguageList] = useState([]);
    const [lessonTranslations, setLessonTranslations] = useState([]);

    useEffect(() => {
        fetchLesson();
        fetchLanguageList();
        fetchLessonTranslations();
    }, []);

    const fetchLanguageList = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/Language/list`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const languageData = await response.json();
                setLanguageList(languageData);
            } else {
                console.error('Failed to fetch language list:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching language list:', error);
        }
    };

    const fetchLesson = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/Lesson/${lessonId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const lessonData = await response.json();
                setLessonName(lessonData.nameNonAscii); // Assuming the name property is available in the lesson data
            } else {
                console.error('Failed to fetch lesson:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching lesson:', error);
        }
    };

    const fetchLessonTranslations = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/Lesson/${lessonId}/translations`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const lessonTranslationsData = await response.json();
                setLessonTranslations(lessonTranslationsData);
            } else {
                console.error('Failed to fetch lesson translations:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching lesson translations:', error);
        }
    };

    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const handleChange = e => {
        const { name, value } = e.target;

        if (name === 'languageCode') {
            // Update the language code
            setFormData({ ...formData, languageCode: value });
        } else {
            // Handle other form field changes
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async e => {
      e.preventDefault();
      try {
          console.log(formData);
          const token = localStorage.getItem('token');
          const response = await fetch(`${BASE_URL}/Lesson/${lessonId}/translations`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(formData),
          });
  
          if (response.ok) {
              toast.success('Lesson translation added successfully');
              // Clear form fields after successful lesson translation creation
              setFormData({
                  name: '',
                  description: '',
                  numberOfAssignment: '',
                  numberOfStudent: '',
                  numberOfVideo: '',
                  languageCode: 'en', // Reset language code to default
              });
              // Fetch lesson translations again to refresh the list
              fetchLessonTranslations();
              // Redirect or perform any other action upon successful lesson translation creation
          } else {
              toast.error('Failed to add lesson translation:', response.statusText);
          }
      } catch (error) {
          toast.error('Error adding lesson translation:', error);
      }
  };  

    return (
        <div className="site-section">
            <ToastContainer/>
            <div className="container-fluid">
                <div className="card mb-4">
                    <div className="card-header">
                        <strong>{t('CreateLessonTranslation')}</strong>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <p>{t('LessonTitle')}: {lessonTitle}</p>
                            <div className="col-md-6">
                                <label className="form-label" htmlFor="inputLanguageCode">{t('LanguageCode')}</label>
                                <select className="form-select custom-select" id="inputLanguageCode" name="languageCode" value={formData.languageCode} onChange={handleChange}>
                                    <option value="">{t('SelectLanguage')}</option>
                                    {languageList.map(language => (
                                        <option key={language.code} value={language.code}>{language.name}</option>
                                    ))}
                                </select>
                            </div>
                            {/* Name */}
                            <div className="mb-3">
                                <label htmlFor="title" className="form-label">{t('Title')}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            {/* Description */}
                            <div className="mb-3">
                                <label htmlFor="content" className="form-label">{t('Content')}</label>
                                <textarea
                                    className="form-control"
                                    id="content"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>
                            {/* Other translation fields */}
                            {/* You can add other translation fields similarly */}
                            <Link className="btn btn-secondary me-2" to={`/admin-create-lesson/${courseId}`}>{t('Back')}</Link>
                            <button type="submit" className="btn btn-primary">{t('CreateTranslation')}</button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="container-fluid mt-4">
                <div className="card">
                    <div className="card-header">
                        <strong>{t('LessonTranslations')}</strong>
                    </div>
                    <div className="card-body">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>{t('LanguageCode')}</th>
                                    <th>{t('Title')}</th>
                                    <th>{t('Content')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lessonTranslations.map(translation => (
                                    <tr key={translation.languageCode}>
                                        <td>{translation.languageCode}</td>
                                        <td>{translation.title}</td>
                                        <td>{translation.content}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminLessonTranslationCreate;