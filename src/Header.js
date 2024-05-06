import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider';
import i18n from './i18n';

function Header({ isAuthenticated, username, userId }) {
  const { t } = useTranslation();
  const { changeLanguage } = useLanguage();
  const [languageList, setLanguageList] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('ru-RU');
  const [userData, setUserData] = useState(null);
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  useEffect(() => {
    fetchLanguageList();
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

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

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/User/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUserData(userData); // Set user data including avatarUrl
      } else {
        console.error('Failed to fetch user data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
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
      {/* Other header content */}
      <div className="site-mobile-menu site-navbar-target">
        <div className="site-mobile-menu-header">
          <div className="site-mobile-menu-close mt-3">
            <span className="icon-close2 js-menu-toggle"></span>
          </div>
        </div>
        <div className="site-mobile-menu-body"></div>
      </div>
  
      <div className="py-2 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-9 d-none d-lg-block">
              <a href="#" className="small mr-3">
                <span className="icon-question-circle-o mr-2"></span> {t('HaveAquestions?')}
              </a>
              <a href="#" className="small mr-3">
                <span className="icon-phone2 mr-2"></span> 10 20 123 456
              </a>
              <a href="#" className="small mr-3">
                <span className="icon-envelope-o mr-2"></span> info@mydomain.com
              </a>
            </div>
            <div className="col-lg-3 text-right">
              {/* Language Selector */}
              <div>
                  <select className="custom-select" value={selectedLanguage} onChange={handleLanguageChange}>
                    {languageList.map((language) => (
                      <option key={language.code} value={language.code}>
                        {language.name}
                      </option>
                    ))}
                  </select>
                </div>
              {isAuthenticated ? (
                
                <div>
                  <Link to={`/user-detail/${userId}`} className="nav-link text-left">
                    {username}
                    {userData && userData.avatarUrl && (
                      <img
                        src={userData.avatarUrl}
                        alt="User Avatar"
                        className="avatar"
                        style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                      />
                    )}
                  </Link>
                  <button className="btn btn-link text-left" onClick={handleLogout}>{t('SignOut')}</button>
                </div>
                
              ) : (
                <div>
                  
                  <div>
                    <Link to="/login" className="small mr-3">
                      <span className="icon-unlock-alt"></span> {t('Login')} {/* Translate login */}
                    </Link>
                    <Link to="/register" className="small btn btn-primary px-4 py-2 rounded-0">
                      <span className="icon-users"></span> {t('Register')} {/* Translate register */}
                    </Link>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
  
      <header className="site-navbar py-4 js-sticky-header site-navbar-target" role="banner">
        <div className="container">
          <div className="d-flex align-items-center">
            <div className="site-logo">
              <a href="index.html" className="d-block">
                <img src="images/logo.jpg" alt="Image" className="img-fluid" />
              </a>
            </div>
            <div className="mr-auto">
              <nav className="site-navigation position-relative text-right" role="navigation">
                <ul className="site-menu main-menu js-clone-nav mr-auto d-none d-lg-block">
                  <li>
                    <Link to="/home" className="nav-link text-left">{t('Home')}</Link>
                  </li>
                  <li>
                  <Link to="/course-list" className="nav-link text-left">{t('Courses')}</Link>
                  </li>
                  <li>
                    <Link to="/exam-list" className="nav-link text-left">{t('Exams')}</Link>
                  </li>
                  <li>
                    <Link to="/history" className="nav-link text-left">{t('History')}</Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="ml-auto">
              <div className="social-wrap">
                <a href="#"><span className="icon-facebook"></span></a>
                <a href="#"><span className="icon-twitter"></span></a>
                <a href="#"><span className="icon-linkedin"></span></a>
                <a href="#" className="d-inline-block d-lg-none site-menu-toggle js-menu-toggle text-black">
                  <span className="icon-menu h3"></span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );  
}

export default Header;