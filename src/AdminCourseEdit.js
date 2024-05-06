import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function AdminCourseEdit() {
  const { t } = useTranslation();
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState({
    name: '',
    categoryId: '',
    authorId: '',
    status: 0,
    nameNonAscii: '',
    isHot: false,
    tags: '',
    courseImageUrl: '',
  });

  useEffect(() => {
    fetchCourseData();
  }, []); // Fetch course data once when component mounts

  const fetchCourseData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/Course/${courseId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const course = await response.json();
        setCourseData(course);
      } else {
        console.error('Failed to fetch course data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching course data:', error);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setCourseData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/Course/${courseId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...courseData, courseId })
      });
      if (response.ok) {
        alert('Course information updated successfully!');
      } else {
        console.error('Failed to update course information:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating course information:', error);
    }
  };

  return (
    <div className="site-section">
      <div className="tab-content rounded-bottom">
        <div className="tab-pane p-3 active preview" role="tabpanel" id="preview-1003">
          <div className="col-12">
            <div className="card mb-4">
              <div className="card-header"><strong>{t('EDIT_COURSE')}</strong></div>
              <div className="card-body">
                <form className="row g-3" onSubmit={handleSubmit}>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="inputName">{t('Name-NonAscii')}</label>
                    <input className="form-control" id="inputNameNonAscii" type="text" name="nameNonAscii" value={courseData.nameNonAscii} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="inputCourseImageUrl">{t('CourseImageURL')}</label>
                    <input className="form-control" id="inputCourseImageUrl" type="text" name="courseImageUrl" value={courseData.courseImageUrl} onChange={handleChange} />
                  </div>
                  <div className="col-12">
                    <Link className="btn btn-secondary me-2" to="/admin-courses">{t('Back')}</Link>
                    <button className="btn btn-primary" type="submit">{t('Submit')}</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCourseEdit;