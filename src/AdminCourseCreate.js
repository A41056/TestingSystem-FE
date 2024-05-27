import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminCourseCreate() {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();

  useEffect(() => {
  }, [selectedLanguage]);
  const [formData, setFormData] = useState({
    nameNonAscii: '',
    categoryId: '',
    authorId: localStorage.getItem('userId'),
    status: '',
    isHot: false,
    tags: '',
    productType: '',
    courseImageUrl: '',
    fullTextSearch: '',
  });

  const [categoryList, setCategoryList] = useState([]);

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    fetchCategoryList();
  }, []); // Fetch category list when component mounts

  const fetchCategoryList = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/Category`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const categoryListData = await response.json();
        setCategoryList(categoryListData);
      } else {
        console.error('Failed to fetch category list:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching category list:', error);
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
      console.log(formData);
      const response = await fetch(`${BASE_URL}/Course`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          CategoryId: formData.categoryId,
          AuthorId: formData.authorId,
          Status: parseInt(formData.status),
          NameNonAscii: formData.nameNonAscii,
          IsHot: formData.isHot,
          Tags: formData.tags,
          CourseImageUrl: formData.courseImageUrl,
          CourseTeacherInsertDto: {
            Id: formData.teacherId,
            TeacherId: localStorage.getItem('userId'),
            CourseId: null,
            SortOrder: null,
            AvatarUrl: null
          }
        }),
      });
  
      if (response.ok) {
        toast.success('Course added successfully');
        // Clear form fields after successful course creation
        setFormData({
          nameNonAscii: '',
          categoryId: '',
          authorId: localStorage.getItem('userId'), // Reset authorId to localStorage value
          status: '',
          isHot: false,
          tags: '',
          productType: '',
          courseImageUrl: '',
          fullTextSearch: '',
          teacherId: '', // Clear teacherId field
        });
        // Redirect or perform any other action upon successful course creation
      } else {
        toast.error('Failed to add course:', response.statusText);
      }
    } catch (error) {
      toast.error('Error adding course:', error);
    }
  };    

  return (
    <div className="site-section">
      <ToastContainer/>
      <div className="container-fluid">
        <div className="card mb-4">
          <div className="card-header">
            <strong>{t('CreateCourse')}</strong>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {/* Category */}
              <div className="mb-3">
                <label htmlFor="categoryId" className="form-label">{t('Category')}</label>
                <select
                  className="form-select"
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t('SelectCategory')}</option>
                  {categoryList.map(category => (
                    <option key={category.id} value={category.id}>{category.nameNonAscii}</option>
                  ))}
                </select>
              </div>
              {/* Name (Non-Ascii) */}
              <div className="mb-3">
                <label htmlFor="nameNonAscii" className="form-label">{t('NameNon-Ascii')}</label>
                <input
                  type="text"
                  className="form-control"
                  id="nameNonAscii"
                  name="nameNonAscii"
                  value={formData.nameNonAscii}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Is Hot */}
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="isHot"
                  name="isHot"
                  checked={formData.isHot}
                  onChange={handleChange}
                />
                <label htmlFor="isHot" className="form-check-label">{t('IsHot')}</label>
              </div>
              {/* Tags */}
              <div className="mb-3">
                <label htmlFor="tags" className="form-label">{t('Tags')}</label>
                <input
                  type="text"
                  className="form-control"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                />
              </div>
              {/* Course Image URL */}
              <div className="mb-3">
                <label htmlFor="courseImageUrl" className="form-label">{t('CourseImageURL')}</label>
                <input
                  type="text"
                  className="form-control"
                  id="courseImageUrl"
                  name="courseImageUrl"
                  value={formData.courseImageUrl}
                  onChange={handleChange}
                />
              </div>
              {/* Status */}
              <div className="mb-3">
                <label htmlFor="status" className="form-label">{t('Status')}</label>
                <select
                  className="form-select"
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="">{t('SelectStatus')}</option>
                  <option value="0">{t('Active')}</option>
                  <option value="1">{t('Inactive')}</option>
                </select>
              </div>
              <Link className="btn btn-secondary me-2" to="/admin-courses">{t('Back')}</Link>
              <button type="submit" className="btn btn-primary">{t('CreateCourse')}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );  
}

export default AdminCourseCreate;