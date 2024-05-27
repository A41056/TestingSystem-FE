import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminCategoryEdit() {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();

  useEffect(() => {
  }, [selectedLanguage]);

  const { categoryId } = useParams(); // Get the category ID from the URL params
  const [formData, setFormData] = useState({
    nameNonAscii: '',
    sortOrder: '',
    isActive: false,
  });
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    fetchCategory();
  }, []); // Fetch category information when component mounts

  const fetchCategory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/Category/${categoryId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const categoryData = await response.json();
        // Update form data with category information
        setFormData({
          nameNonAscii: categoryData.nameNonAscii,
          sortOrder: categoryData.sortOrder,
          isActive: categoryData.isActive,
        });
      } else {
        toast.error('Failed to fetch category:', response.statusText);
        console.error('Failed to fetch category:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      toast.error('Error fetching category:', error);
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
      const response = await fetch(`${BASE_URL}/Category/${categoryId}`, {
        method: 'PUT', // Assuming this is for updating an existing category
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Category updated successfully');
        // Redirect or perform any other action upon successful category update
      } else {
        console.error('Failed to update category:', response.statusText);
        toast.error('Failed to update category:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Error updating category:', error);
    }
  };
  
  return (
    <div className="site-section">
      <ToastContainer/>
      <div className="tab-content rounded-bottom">
        <div className="tab-pane p-3 active preview" role="tabpanel" id="preview-1003">
          <div className="col-12">
            <div className="card mb-4">
              <div className="card-header"><strong>{t('EDITCATEGORY')}</strong></div>
              <div className="card-body">
                <form className="row g-3" onSubmit={handleSubmit}>
                  {/* Name Non-Ascii */}
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="inputNameNonAscii">{t('NameNon-Ascii')}</label>
                    <input className="form-control" id="inputNameNonAscii" type="text" name="nameNonAscii" value={formData.nameNonAscii} onChange={handleChange} />
                  </div>
                  {/* Sort Order */}
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="inputSortOrder">{t('SortOrder')}</label>
                    <input className="form-control" id="inputSortOrder" type="text" name="sortOrder" value={formData.sortOrder} onChange={handleChange} />
                  </div>
                  {/* Is Active */}
                  <div className="col-md-6">
                    <div className="form-check">
                      <input className="form-check-input" id="inputIsActive" type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
                      <label className="form-check-label" htmlFor="inputIsActive">{t('IsActive')}</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <Link className="btn btn-secondary me-2" to="/admin-categories">{t('Back')}</Link>
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

export default AdminCategoryEdit;
