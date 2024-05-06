import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider';
import i18n from './i18n';

function AdminHeader({ isAuthenticated, username }) {
  const { t } = useTranslation();
  const { changeLanguage } = useLanguage();
  const [languageList, setLanguageList] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('ru-RU');
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    fetchLanguageList();
  },[]);

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

  const handleLanguageChange = (event) => {
    const selectedLanguageCode = event.target.value;
    setSelectedLanguage(selectedLanguageCode); // Update selected language
    changeLanguage(selectedLanguageCode);
    console.log("Header selectedLanguageCode:", selectedLanguageCode);
    i18n.changeLanguage(selectedLanguageCode);
  };

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div>
      <div className="site-mobile-menu site-navbar-target">
        <div className="site-mobile-menu-header">
          <div className="site-mobile-menu-close mt-3">
            <span className="icon-close2 js-menu-toggle"></span>
          </div>
        </div>
        <div className="site-mobile-menu-body"></div>
      </div>

      <header className="site-navbar py-4 js-sticky-header site-navbar-target admin-header" role="banner">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center"> {/* Change to justify-content-between */}
            <div className="site-logo">
              
            </div>
            <nav className="site-navigation position-relative text-right" role="navigation">
              <ul className="site-menu main-menu js-clone-nav mr-auto d-none d-lg-block">
                <li>
                  <Link to="/admin-users" className="nav-link text-left">{t('Users')}</Link>
                </li>
                <li>
                  <Link to="/admin-exams" className="nav-link text-left">{t('Exams')}</Link>
                </li>
                <li>
                  <Link to="/admin-categories" className="nav-link text-left">{t('Categories')}</Link>
                </li>
                <li>
                  <Link to="/admin-courses" className="nav-link text-left">{t('Courses')}</Link>
                </li>
              </ul>
            </nav>
            <div> {/* Add a div to contain the language selector */}
              <select className="custom-select" value={selectedLanguage} onChange={handleLanguageChange}>
                {languageList.map((language) => (
                  <option key={language.code} value={language.code}>
                    {language.name}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn btn-link text-left" onClick={handleLogout}>{t('SignOut')}</button>
          </div>
        </div>
      </header>
    </div>
  );
}

export default AdminHeader;