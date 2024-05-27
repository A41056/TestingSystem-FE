import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminCourseTranslationCreate() {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();

  useEffect(() => {
  }, [selectedLanguage]);
    const { courseId } = useParams(); // Get the category ID from the URL params
    const [courseName, setCourseName] = useState('');
    const [formData, setFormData] = useState({
      name: '',
      description: '',
      numberOfAssignment: '',
      numberOfStudent: '',
      numberOfVideo: '',
      languageCode: 'en', // Default language code is 'en' (English)
    });
    const [languageList, setLanguageList] = useState([]);

  useEffect(() => {
    fetchCourse();
    fetchLanguageList();
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

  const fetchCourse = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/Course/${courseId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const courseData = await response.json();
            setCourseName(courseData.nameNonAscii); // Assuming the name property is available in the course data
        } else {
            console.error('Failed to fetch course:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching course:', error);
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
      const response = await fetch(`${BASE_URL}/Course/${courseId}/translations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Course translation added successfully');
        // Clear form fields after successful course translation creation
        setFormData({
          name: '',
          description: '',
          numberOfAssignment: '',
          numberOfStudent: '',
          numberOfVideo: '',
          languageCode: 'en', // Reset language code to default
        });
        // Redirect or perform any other action upon successful course translation creation
      } else {
        toast.error('Failed to add course translation:', response.statusText);
      }
    } catch (error) {
      toast.error('Error adding course translation:', error);
    }
  };

  return (
    <div className="site-section">
      <ToastContainer/>
      <div className="container-fluid">
        <div className="card mb-4">
          <div className="card-header">
            <strong>{t('CreateCourseTranslation')}</strong>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
                <p>{t('CourseName')}: {courseName}</p>
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
                <label htmlFor="name" className="form-label">{t('Name')}</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Description */}
              <div className="mb-3">
                <label htmlFor="description" className="form-label">{t('Description')}</label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              {/* Other translation fields */}
              {/* You can add other translation fields similarly */}
              <Link className="btn btn-secondary me-2" to="/admin-courses">{t('Back')}</Link>
              <button type="submit" className="btn btn-primary">{t('CreateTranslation')}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );  
}

export default AdminCourseTranslationCreate;
