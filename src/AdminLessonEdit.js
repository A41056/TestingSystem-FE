import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function AdminLessonEdit() {
  const { t } = useTranslation();
  const { courseId,lessonId } = useParams();
  const [lessonData, setLessonData] = useState({
    title: '',
    videoUrl: '',
    sortOrder: 0,
    courseId: '', // Add courseId if needed
  });

  useEffect(() => {
    if (lessonId) { // Check if lessonId is not empty
      fetchLessonData();
    }
  }, [lessonId]); // Only fetch lesson data when lessonId changes

  const fetchLessonData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/lesson/${lessonId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const lesson = await response.json();
        setLessonData(lesson);
      } else {
        console.error('Failed to fetch lesson data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching lesson data:', error);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setLessonData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BASE_URL}/lesson/${lessonId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...lessonData, lessonId }), // Include lessonId in the request body
      });
      if (response.ok) {
        alert('Lesson information updated successfully!');
      } else {
        console.error('Failed to update lesson information:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating lesson information:', error);
    }
  };  

  return (
    <div className="site-section">
      <div className="tab-content rounded-bottom">
        <div className="tab-pane p-3 active preview" role="tabpanel" id="preview-1003">
          <div className="col-12">
            <div className="card mb-4">
              <div className="card-header"><strong>{t('EDIT_LESSON')}</strong></div>
              <div className="card-body">
                <form className="row g-3" onSubmit={handleSubmit}>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="inputTitle">{t('Title')}</label>
                    <input className="form-control" id="inputTitle" type="text" name="title" value={lessonData.title} onChange={handleChange} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="inputVideoUrl">{t('VideoUrl')}</label>
                    <input className="form-control" id="inputVideoUrl" type="text" name="videoUrl" value={lessonData.videoUrl} onChange={handleChange} />
                  </div>
                  {/* Add input fields for other lesson properties if needed */}
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="inputSortOrder">{t('SortOrder')}</label>
                    <input className="form-control" id="inputSortOrder" type="number" name="sortOrder" value={lessonData.sortOrder} onChange={handleChange} />
                  </div>
                  <div className="col-12">
                    <Link className="btn btn-secondary me-2" to={`/admin-create-lesson/${courseId}`}>{t('Back')}</Link>
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

export default AdminLessonEdit;