import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider';

function AdminCourseManager() {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();

  const [courses, setCourses] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [courseNameTranslations, setCourseNameTranslations] = useState({});
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    fetchCourses();
  }, [searchInput]); // Refetch courses when searchInput changes

  useEffect(() => {
    fetchCourseNameTranslations();
  }, [selectedLanguage, courses]); // Fetch course name translations when selected language or courses change

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      let apiUrl = `${BASE_URL}/Course/list`;
      if (searchInput.trim() !== '') {
        apiUrl += `?NameNonAscii=${searchInput}`;
      }
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const courseList = await response.json();
        setCourses(courseList.data);
      } else {
        console.error('Failed to fetch courses:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

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

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/Course/delete/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Update the courses state to reflect the deletion
        setCourses(courses.filter((course) => course.id !== courseId));
        console.log('Course deleted successfully!');
      } else {
        console.error('Failed to delete course:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return (
    <div className="site-section">
      <div className="container-fluid">
        <div className="card mb-4">
          <div className="card-header">
            <strong>{t('Courses')}</strong>
          </div>
          <div className="card-body">
            <form className="row g-3 align-items-center">
              <div className="col-auto">
                <input
                  type="text"
                  className="form-control"
                  placeholder={t('SearchCourse')}
                  value={searchInput}
                  onChange={handleSearchInputChange}
                />
              </div>
              <div className="col-auto">
                <Link to="/admin-create-course" className="btn btn-primary">{t('CreateCourse')}</Link>
              </div>
            </form>
            <table className="table table-hover mt-3">
              {/* Table header */}
              <thead>
                <tr>
                  <th scope="col">{t('Number')}</th>
                  <th scope="col">{t('Name')}</th>
                  <th scope="col">{t('Category')}</th>
                  <th scope="col">{t('Author')}</th>
                  <th scope="col">{t('Status')}</th>
                  <th scope="col">{t('Action')}</th>
                </tr>
              </thead>
              {/* Table body */}
              <tbody>
                {courses.length === 0 ? (
                  <tr>
                    <td colSpan="6">{t('Nocoursesavailable')}</td>
                  </tr>
                ) : (
                  courses.map((course, index) => (
                    <tr key={course.id}>
                      <td>{index + 1}</td>
                      <td>{courseNameTranslations[course.id]}</td>
                      <td>{course.categoryId}</td>
                      <td>{course.authorId}</td>
                      <td>{course.status}</td>
                      <td className="d-flex align-items-center">
                        <Link to={`/admin-edit-course/${course.id}`} className="me-2">{t('Edit')}</Link>
                        <Link to={`/admin-create-course-translation/${course.id}`} className="btn btn-primary ms-2">{t('CreateTranslation')}</Link>
                        <Link to={`/admin-create-lesson/${course.id}`} className="btn btn-primary ms-2">{t('CreateLesson')}</Link>
                        <button
                          className="btn btn-danger ms-2"
                          onClick={() => handleDeleteCourse(course.id)}
                        >
                          {t('Delete')}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCourseManager;