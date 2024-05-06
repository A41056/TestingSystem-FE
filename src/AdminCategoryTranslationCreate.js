import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider'; 

function AdminCategoryTranslationCreate() {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();

  useEffect(() => {
  }, [selectedLanguage]);

  const { categoryId } = useParams(); // Get the category ID from the URL params
  const [category, setCategory] = useState(null);
  const [translationData, setTranslationData] = useState({
    name: '',
    description: '',
    languageCode: '',
  });
  const [languageList, setLanguageList] = useState([]);
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    fetchCategory();
    fetchLanguageList();
  }, []); // Fetch category information and language list when component mounts

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
        setCategory(categoryData);
      } else {
        console.error('Failed to fetch category:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching category:', error);
    }
  };

  const fetchLanguageList = async () => {
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
        const languageData = await response.json();
        setLanguageList(languageData);
      } else {
        console.error('Failed to fetch language list:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching language list:', error);
    }
  };

  const handleChange = e => {
    setTranslationData({ ...translationData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/Category/${categoryId}/translations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(translationData),
      });

      if (response.ok) {
        alert('Translation added successfully');
        // Clear form fields after successful translation creation
        setTranslationData({
          name: '',
          description: '',
          languageCode: '',
        });
        // Redirect or perform any other action upon successful translation creation
      } else {
        console.error('Failed to add translation:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding translation:', error);
    }
  };
  
  if (!category || !languageList.length) {
    return <div>Loading...</div>; // Show loading indicator while fetching category and language list
  }

  return (
    <div className="site-section">
      <div className="tab-content rounded-bottom">
        <div className="tab-pane p-3 active preview" role="tabpanel" id="preview-1003">
          <div className="col-12">
            <div className="card mb-4">
              <div className="card-header"><strong>{t('CREATETRANSLATIONFORCATEGORY:')} {category.nameNonAscii}</strong></div>
              <div className="card-body">
                <form className="row g-3" onSubmit={handleSubmit}>
                    {/* Language Code */}
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="inputLanguageCode">{t('LanguageCode')}</label>
                    <select className="form-select custom-select" id="inputLanguageCode" name="languageCode" value={translationData.languageCode} onChange={handleChange}>
                      <option value="">{t('SelectLanguage')}</option>
                      {languageList.map(language => (
                        <option key={language.code} value={language.code}>{language.name}</option>
                      ))}
                    </select>
                  </div>
                  {/* Name */}
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="inputName">{t('Name')}</label>
                    <input className="form-control" id="inputName" type="text" name="name" value={translationData.name} onChange={handleChange} />
                  </div>
                  {/* Description */}
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="inputDescription">{t('Description')}</label>
                    <input className="form-control" id="inputDescription" type="text" name="description" value={translationData.description} onChange={handleChange} />
                  </div>
                  
                  <div className="col-12">
                    <Link className="btn btn-secondary me-2" to={`/admin-categories`}>{t('Back')}</Link>
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

export default AdminCategoryTranslationCreate;