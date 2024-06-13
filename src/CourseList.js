import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons'; // Correctly import regular heart icon
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CourseList() {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();
  const [courses, setCourses] = useState([]);
  const [courseDetailsTranslations, setCourseDetailsTranslations] = useState({});
  const [favorites, setFavorites] = useState(new Set());
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 15;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/Course/list?pageNum=${pageNum}&pageSize=${PAGE_SIZE}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const coursesList = await response.json();
          setCourses(coursesList.data);
          setTotalPages(coursesList.totalPages);
        } else {
          console.error('Failed to fetch courses:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, [BASE_URL, pageNum]);

  useEffect(() => {
    const fetchCourseDetailsTranslations = async () => {
      try {
        console.log("Fetching name translations for selected language:", selectedLanguage);
        const token = localStorage.getItem('token');
        const updatedCourseDetailsTranslations = {};
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
            updatedCourseDetailsTranslations[course.id] = translations.length > 0 ? translations[0] : {};
          } else {
            console.error(`Failed to fetch course details translation for course ${course.id}:`, response.statusText);
          }
        }
        setCourseDetailsTranslations(updatedCourseDetailsTranslations);
      } catch (error) {
        console.error('Error fetching course details translations:', error);
      }
    };

    fetchCourseDetailsTranslations();
  }, [selectedLanguage, courses, BASE_URL]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const response = await axios.get(`${BASE_URL}/user/favorites/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Fetched favorites:', response.data); // Log fetched favorites
        const favoriteCourseIds = new Set(response.data.map(fav => fav.courseId));
        setFavorites(favoriteCourseIds);
        console.log('Updated favorites state:', favoriteCourseIds); // Log updated state
      } catch (error) {
        console.error('Failed to fetch favorite courses', error);
      }
    };

    fetchFavorites();
  }, [BASE_URL]);

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
        navigate(`/learn/${courseId}`);
      } else {
        console.error('Failed to insert user history:', response.statusText);
      }
    } catch (error) {
      console.error('Error inserting user history:', error);
    }
  };

  const handleDetailButtonClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const handleFavoriteClick = async (courseId) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    if (favorites.has(courseId)) {
      // Remove from favorites
      try {
        await axios.delete(`${BASE_URL}/user/favorite`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            userId,
            courseId,
          },
        });
        setFavorites(prev => {
          const newFavorites = new Set(prev);
          newFavorites.delete(courseId);
          console.log('Removed from favorites:', courseId); // Log removed favorite
          console.log('Updated favorites state:', newFavorites); // Log updated state
          return newFavorites;
        });
        toast.success(t('Course removed from favorites'));
      } catch (error) {
        console.error('Failed to remove favorite course', error);
        toast.error(t('Failed to remove favorite course'));
      }
    } else {
      // Add to favorites
      try {
        await axios.post(`${BASE_URL}/user/favorite`, {
          userId,
          courseId,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFavorites(prev => {
          const newFavorites = new Set(prev).add(courseId);
          console.log('Added to favorites:', courseId); // Log added favorite
          console.log('Updated favorites state:', newFavorites); // Log updated state
          return newFavorites;
        });
        toast.success(t('Course added to favorites'));
      } catch (error) {
        console.error('Failed to mark favorite course', error);
        toast.error(t('Failed to mark favorite course'));
      }
    }
  };

  const handlePageChange = (newPageNum) => {
    if (newPageNum > 0 && newPageNum <= totalPages) {
      setPageNum(newPageNum);
    }
  };

  return (
    <div className="container site-section">
      <ToastContainer />
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
                <h5 className="card-title">{courseDetailsTranslations[course.id]?.name}</h5>
                <p className="card-text">{courseDetailsTranslations[course.id]?.description}</p>
                <div className="btn-group" role="group">
                  <button onClick={() => handleLearnButtonClick(course.id)} className="btn btn-primary">{t('Learn')}</button>
                  <Link to="/course-details" className="btn btn-secondary">{t('Detail')}</Link>
                  <button onClick={() => handleFavoriteClick(course.id)} className="btn btn-light">
                    <FontAwesomeIcon icon={favorites.has(course.id) ? solidHeart : regularHeart} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="row">
        <div className="col-12 d-flex justify-content-center">
          <nav>
            <ul className="pagination">
              <li className={`page-item ${pageNum === 1 ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(pageNum - 1)}>
                  {t('Previous')}
                </button>
              </li>
              {[...Array(totalPages).keys()].map(num => (
                <li key={num + 1} className={`page-item ${pageNum === num + 1 ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => handlePageChange(num + 1)}>
                    {num + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${pageNum === totalPages ? 'disabled' : ''}`}>
                <button className="page-link" onClick={() => handlePageChange(pageNum + 1)}>
                  {t('Next')}
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default CourseList;