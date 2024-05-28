import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider'; // Assuming you have a LanguageProvider context
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CourseDetail() {
  const { t } = useTranslation();
  const { courseId } = useParams(); // Get the course ID from the URL params
  const { selectedLanguage } = useLanguage(); // Get selected language from context
  const [courseDetailId, setCourseDetailId] = useState(null);
  const [translations, setTranslations] = useState([]);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/course/${courseId}/details`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const courseDetails = await response.json();
          setCourseDetailId(courseDetails?.id); // Assuming the ID is present in the response object
        } else {
          console.error('Failed to fetch course details:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    };

    fetchCourseDetails();
  }, [courseId, BASE_URL]);

  useEffect(() => {
    const fetchDetailTranslations = async () => {
      if (!courseDetailId) return;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/course/${courseId}/details/translations/${selectedLanguage}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const translations = await response.json();
          setTranslations(translations);
        } else {
          console.error('Failed to fetch detail translations:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching detail translations:', error);
      }
    };

    fetchDetailTranslations();
  }, [courseDetailId, selectedLanguage, BASE_URL]);

  return (
    <div className="container site-section">
      <ToastContainer />
      <h1>{t('Course Detail')}</h1>
      <div>
        <h2>{t('Translations')}</h2>
        {translations.length > 0 ? (
          translations.map((translation) => (
            <div key={translation.id}>
              <p>{translation.content}</p>
              <p>{translation.documentUrl}</p>
            </div>
          ))
        ) : (
          <p>{t('No translations available')}</p>
        )}
      </div>
    </div>
  );
}

export default CourseDetail;