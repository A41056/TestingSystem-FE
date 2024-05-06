import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider'; 

function AdminCategoryCreate() {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();

  useEffect(() => {
  }, [selectedLanguage]);

  const [formData, setFormData] = useState({
    nameNonAscii: '',
    sortOrder: '',
    isActive: false, // Assuming isActive is initially false
  });
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  const handleChange = e => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/Category`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Category added successfully');
        // Clear form fields after successful category creation
        setFormData({
          nameNonAscii: '',
          sortOrder: '',
          isActive: false,
        });
        // Redirect or perform any other action upon successful category creation
      } else {
        console.error('Failed to add category:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };
  
  return (
    <div className="site-section">
      <div className="tab-content rounded-bottom">
        <div className="tab-pane p-3 active preview" role="tabpanel" id="preview-1003">
          <div className="col-12">
            <div className="card mb-4">
              <div className="card-header"><strong>{t('CREATECATEGORY')}</strong></div>
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

export default AdminCategoryCreate;