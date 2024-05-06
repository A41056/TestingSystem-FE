import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider';

function CourseList() {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [courseNameTranslations, setCourseNameTranslations] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/Course/list`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const coursesList = await response.json();
          setCourses(coursesList.data);
        } else {
          console.error('Failed to fetch courses:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchCourseNameTranslations = async () => {
      try {
        console.log("Fetching name translations for selected language:", selectedLanguage);
        const token = localStorage.getItem('token');
        const updatedCourseNameTranslations = {};
        for (const course of courses) {
          const languageCode = selectedLanguage;
          const response = await fetch(`${BASE_URL}/Course/${course.id}/translations/${languageCode}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const translations = await response.json();
            updatedCourseNameTranslations[course.id] = translations.length > 0 ? translations[0].name : '';
          } else {
            console.error(`Failed to fetch course name translation for course ${course.id}:`, response.statusText);
          }
        }
        setCourseNameTranslations(updatedCourseNameTranslations);
      } catch (error) {
        console.error('Error fetching course name translations:', error);
      }
    };

    fetchCourseNameTranslations();
  }, [selectedLanguage, courses]); // Fetch course name translations when selected language or courses change

  const handleLearnButtonClick = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const response = await fetch(`${BASE_URL}/user/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId: userId, // Replace with the actual user ID
          courseId: courseId,
        }),
      });

      if (response.ok) {
        console.log('User history inserted successfully');
        // Optionally, you can perform any other actions after successful insertion

        navigate(`/learn/${courseId}`);
      } else {
        console.error('Failed to insert user history:', response.statusText);
      }
    } catch (error) {
      console.error('Error inserting user history:', error);
    }
  };  

  return (
    <div className="container site-section">
      <div className="row">
        {courses.map((course, index) => (
          <div key={course.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <img
                src={course.courseImageUrl}
                className="card-img-top"
                alt={`Course ${index}`}
                style={{ objectFit: 'cover', height: '200px' }}
              />
              <div className="card-body">
                <h5 className="card-title">{courseNameTranslations[course.id]}</h5>
                <div className="btn-group" role="group">
                  <button onClick={() => handleLearnButtonClick(course.id)} className="btn btn-primary">{t('Learn')}</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseList;