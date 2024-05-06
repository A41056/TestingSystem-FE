import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider'; 

function AdminLessonCreate() {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();

  useEffect(() => {}, [selectedLanguage]);
  const { courseId } = useParams(); // Get courseId from the URL parameters
  console.log(courseId);
  const [formData, setFormData] = useState({
    title: '',
    videoUrl: '',
    sortOrder: '',
  });
  const [lessons, setLessons] = useState([]);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    fetchLessonsByCourseId();
  }, [courseId]); // Fetch lessons when courseId changes

  const fetchLessonsByCourseId = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/Lesson/${courseId}/lessons`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const lessonData = await response.json();
        // Sort lessons by sortOrder
        lessonData.sort((a, b) => a.sortOrder - b.sortOrder);
        setLessons(lessonData);
      } else {
        console.error('Failed to fetch lessons:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };  

  const handleChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const dataToSend = {
        ...formData,
        courseId: courseId, // Include courseId from URL parameters
      };
  
      const response = await fetch(`${BASE_URL}/Lesson`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (response.ok) {
        alert('Lesson added successfully');
        // Clear form fields after successful lesson creation
        setFormData({
          title: '',
          videoUrl: '',
          sortOrder: '',
        });
        // Fetch lessons again to update the list
        fetchLessonsByCourseId();
      } else {
        console.error('Failed to add lesson:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding lesson:', error);
    }
  };  

  const handleDeleteLesson = async (lessonId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/Lesson/${lessonId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        // Remove the lesson from the state
        setLessons(lessons.filter((lesson) => lesson.id !== lessonId));
        console.log('Lesson deleted successfully!');
      } else {
        console.error('Failed to delete lesson:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
    }
  };

  return (
    <div className="site-section">
      <div className="tab-content rounded-bottom">
        <div className="tab-pane p-3 active preview" role="tabpanel" id="preview-1003">
          <div className="col-12">
            <div className="card mb-4">
              <div className="card-header"><strong>{t('CREATELESSON')}</strong></div>
              <div className="card-body">
                <form className="row g-3" onSubmit={handleSubmit}>
                  {/* Title */}
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="inputTitle">{t('Title')}</label>
                    <input className="form-control" id="inputTitle" type="text" name="title" value={formData.title} onChange={handleChange} />
                  </div>
                  {/* Video URL */}
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="inputVideoUrl">{t('VideoURL')}</label>
                    <input className="form-control" id="inputVideoUrl" type="text" name="videoUrl" value={formData.videoUrl} onChange={handleChange} />
                  </div>
                  {/* Sort Order */}
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="inputSortOrder">{t('SortOrder')}</label>
                    <input className="form-control" id="inputSortOrder" type="text" name="sortOrder" value={formData.sortOrder} onChange={handleChange} />
                  </div>
                  <div className="col-12">
                    <Link className="btn btn-secondary me-2" to={`/admin-courses`}>{t('Back')}</Link>
                    <button className="btn btn-primary" type="submit">{t('Submit')}</button>
                  </div>
                </form>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-header"><strong>{t('LESSONS')}</strong></div>
              <div className="card-body">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>{t('SortOrder')}</th>
                      <th>{t('Title')}</th>
                      <th>{t('VideoURL')}</th>
                      <th scope="col">{t('Action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lessons.length === 0 ? (
                      <tr>
                        <td colSpan="4">{t('Nolessonsavailable')}</td>
                      </tr>
                    ) : (
                      lessons.map(lesson => (
                        <tr key={lesson.id}>
                          <td>{lesson.sortOrder}</td>
                          <td>{lesson.title}</td>
                          <td>{lesson.videoUrl}</td>
                          <td className="d-flex align-items-center">
                            <Link to={`/admin-edit-lesson/${courseId}/${lesson.id}`} className="me-2">{t('Edit')}</Link>
                            <Link to={`/admin-create-lesson-translation/${courseId}/${lesson.id}`} className="btn btn-primary ms-2">{t('CreateTranslation')}</Link>
                            <button
                              className="btn btn-danger ms-2"
                              onClick={() => handleDeleteLesson(lesson.id)}
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
      </div>
    </div>
  );
}

export default AdminLessonCreate;