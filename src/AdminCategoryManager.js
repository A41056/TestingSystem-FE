import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider'; 

function AdminCategoryManager() {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();

  useEffect(() => {
  }, [selectedLanguage]);

  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('');

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    fetchCategories();
  }, [filter]); // Refetch categories when filter changes

  const fetchCategories = async () => {
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
        const categoryList = await response.json();
        setCategories(categoryList);
      } else {
        console.error('Failed to fetch categories:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = e => {
    setFilter(e.target.value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Fetch categories with updated filter value
    fetchCategories();
  };

  return (
    <div className="site-section">
      <div className="container-fluid">
        <div className="card mb-4">
          <div className="card-header">
            <strong>Categories</strong>
          </div>
          <div className="card-body">
            <form className="row g-3 align-items-center" onSubmit={handleSubmit}>
              <div className="col-auto">
                <label className="visually-hidden" htmlFor="categoryName">{t('CategoryName')}</label>
                <input
                  className="form-control"
                  id="categoryName"
                  type="text"
                  placeholder="Search by category name"
                  value={filter}
                  onChange={handleChange}
                />
              </div>
              <div className="col-auto">
                <button className="btn btn-primary" type="submit">{t('Search')}</button>
              </div>
              <div className="col-auto">
                <Link to="/admin-create-category" className="btn btn-primary">{t('CreateCategory')}</Link>
              </div>
            </form>
            <table className="table table-hover mt-3">
              {/* Table header */}
              <thead>
                <tr>
                  <th scope="col">{t('Number')}</th>
                  <th scope="col">{t('Name')}</th>
                  <th scope="col">{t('SortOrder')}</th>
                  <th scope="col">{t('Active')}</th>
                  <th scope="col">{t('Action')}</th>
                </tr>
              </thead>
              {/* Table body */}
              <tbody>
                {categories.map((category, index) => (
                    <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{category.nameNonAscii}</td>
                    <td>{category.sortOrder}</td>
                    <td>{category.isActive ? 'Yes' : 'No'}</td>
                    <td className="d-flex align-items-center"> {/* Align items center */}
                        <Link to={`/admin-edit-category/${category.id}`} className="me-2">{t('Edit')}</Link> {/* Add margin-right */}
                        <Link to={`/admin-create-category-translation/${category.id}`} className="btn btn-primary ms-2">{t('CreateTranslation')}</Link> {/* Add margin-left */}
                    </td>
                    </tr>
                ))}
                </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCategoryManager;