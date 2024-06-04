import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CourseDetail() {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();
  const [courseDetails, setCourseDetails] = useState([]);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    const fetchCoursesAndDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const courseListResponse = await axios.get(`${BASE_URL}/Course/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (courseListResponse.status === 200) {
          const courses = courseListResponse.data.data;
          const courseDetailsPromises = courses.map(async (course) => {
            const response = await axios.get(`${BASE_URL}/Course/${course.id}/details/translations/${selectedLanguage}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            return response.data.length > 0 ? { ...course, ...response.data[0] } : course;
          });

          const courseDetails = await Promise.all(courseDetailsPromises);
          setCourseDetails(courseDetails);
        } else {
          console.error('Failed to fetch courses:', courseListResponse.statusText);
        }
      } catch (error) {
        console.error('Error fetching courses and details:', error);
      }
    };

    fetchCoursesAndDetails();
  }, [selectedLanguage, BASE_URL]);

  const renderDocumentLinks = (documentUrl) => {
    if (!documentUrl) return null;
    const urls = documentUrl.split(',').map(url => url.trim());
    return urls.map((url, idx) => (
      <a key={idx} href={url} className="btn btn-link" target="_blank" rel="noopener noreferrer">
        {t('View Document')} {idx + 1}
      </a>
    ));
  };

  return (
    <div className="container site-section">
      <ToastContainer />
      <div className="row">
        {courseDetails.map((course, index) => (
          <div key={course.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <img
                src={course.courseImageUrl}
                className="card-img-top"
                alt={`Course ${index}`}
                style={{ objectFit: 'cover', height: '200px' }}
              />
              <div className="card-body">
                <h5 className="card-title">{course.name}</h5>
                <p className="card-text">{course.description}</p>
                <p className="card-text">{course.content}</p>
                {renderDocumentLinks(course.documentUrl)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourseDetail;