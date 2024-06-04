import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminCourseDetailCreate() {
  const { t } = useTranslation();
  const { courseId } = useParams(); // Get the course ID from the URL params
  const [formData, setFormData] = useState({
    content: '',
    documentUrl: '',
    sortOrder: 0,
    languageCode: '', // Added languageCode field for translation
  });
  const [languageList, setLanguageList] = useState([]);
  const [detailTranslations, setDetailTranslations] = useState([]);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    fetchLanguageList();
    fetchCourseDetails();
  }, []);

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
        const courseDetailId = courseDetails?.id; // Assuming the ID is present in the response object
        if (courseDetailId) {
          fetchDetailTranslations(courseDetailId);
        }
      } else {
        console.error('Failed to fetch course details:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
    }
  };

  const fetchLanguageList = async () => {
    // Fetch the list of languages
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
        const languages = await response.json();
        setLanguageList(languages);
      } else {
        console.error('Failed to fetch language list:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching language list:', error);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/course/details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(courseId),
      });

      if (response.ok) {
        const data = await response.json();
        const courseDetailId = data;
        // Insert course detail translation
        const translationResponse = await fetch(`${BASE_URL}/course/${courseDetailId}/details/translations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ ...formData, courseDetailId: courseDetailId }),
        });

        if (translationResponse.ok) {
          toast.success('Course detail and translation added successfully');
          // Clear form fields after successful creation
          setFormData({
            content: '',
            documentUrl: '',
            sortOrder: 0,
            languageCode: '',
          });
          // Refresh detail translations list
          fetchDetailTranslations(courseDetailId);
        } else {
          toast.error('Failed to add course detail translation:', translationResponse.statusText);
        }
      } else {
        toast.error('Failed to add course detail:', response.statusText);
      }
    } catch (error) {
      toast.error('Error adding course detail:', error);
    }
  };

  const fetchDetailTranslations = async (courseDetailId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/course/details/translations/${courseDetailId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const translations = await response.json();
        setDetailTranslations(translations);
      } else {
        console.error('Failed to fetch detail translations:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching detail translations:', error);
    }
  };

  return (
    <div className="site-section">
      <ToastContainer />
      <div className="container-fluid">
        <div className="card mb-4">
          <div className="card-header">
            <strong>{t('CreateCourseDetail')}</strong>
          </div>
          <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="content" className="form-label">{t('Content')}</label>
              <textarea
                className="form-control"
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="documentUrl" className="form-label">{t('DocumentUrl')}</label>
              <input
                type="text"
                className="form-control"
                id="documentUrl"
                name="documentUrl"
                value={formData.documentUrl}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="sortOrder" className="form-label">{t('SortOrder')}</label>
              <input
                type="number"
                className="form-control"
                id="sortOrder"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="languageCode" className="form-label">{t('LanguageCode')}</label>
              <select
                className="form-select custom-select"
                id="languageCode"
                name="languageCode"
                value={formData.languageCode}
                onChange={handleChange}
                required
              >
                <option value="">{t('SelectLanguage')}</option>
                {languageList.map(language => (
                  <option key={language.code} value={language.code}>{language.name}</option>
                ))}
              </select>
            </div>
            <Link className="btn btn-secondary me-2" to="/admin-courses">{t('Back')}</Link>
            <button type="submit" className="btn btn-primary">{t('CreateDetail')}</button>
          </form>
          </div>
        </div>
      </div>
      <div className="container-fluid mt-4">
        <div className="card">
          <div className="card-header">
            <strong>{t('CourseDetailTranslations')}</strong>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>{t('LanguageCode')}</th>
                    <th>{t('Content')}</th>
                    <th>{t('DocumentUrl')}</th>
                  </tr>
                </thead>
                <tbody>
                  {detailTranslations.map(translation => (
                    <tr key={translation.id}>
                      <td>{translation.languageCode}</td>
                      <td>
                        <div className="content-wrapper">
                          {translation.content}
                        </div>
                      </td>
                      <td>
                        <div className="content-wrapper">
                          {translation.documentUrl}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );   
}

export default AdminCourseDetailCreate;