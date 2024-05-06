import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider';

function History() {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();
  const [userHistory, setUserHistory] = useState([]);
  const [courseNameTranslations, setCourseNameTranslations] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchUserHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId'); // Get the userId from localStorage
        const response = await fetch(`${BASE_URL}/user/${userId}/history`, { // Fetch user history
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userHistoryData = await response.json();
          setUserHistory(userHistoryData);
          // Fetch course translations after fetching user history
          fetchCourseTranslations(userHistoryData);
        } else {
          console.error('Failed to fetch user history:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user history:', error);
      }
    };

    const fetchCourseTranslations = async (userHistoryData) => {
      try {
        console.log("Fetching course translations for selected language:", selectedLanguage);
        const token = localStorage.getItem('token');
        const updatedCourseNameTranslations = {};
        for (const historyItem of userHistoryData) {
          const languageCode = selectedLanguage;
          const response = await fetch(`${BASE_URL}/Course/${historyItem.courseId}/translations/${languageCode}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const translations = await response.json();
            updatedCourseNameTranslations[historyItem.courseId] = translations.length > 0 ? translations[0].name : '';
          } else {
            console.error(`Failed to fetch course name translation for course ${historyItem.courseId}:`, response.statusText);
          }
        }
        setCourseNameTranslations(updatedCourseNameTranslations);
      } catch (error) {
        console.error('Error fetching course name translations:', error);
      }
    };

    fetchUserHistory();
  }, [selectedLanguage]); // Fetch course translations when selected language changes

  return (
    <div className="container site-section">
      <h2>{t('UserHistory')}</h2>
      <div className="row">
        <div className="col">
          <table className="table">
            <thead>
              <tr>
                <th>{t('CourseName')}</th>
              </tr>
            </thead>
            <tbody>
              {userHistory.map((historyItem, index) => (
                <tr key={index}>
                  <td>{courseNameTranslations[historyItem.courseId]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default History;