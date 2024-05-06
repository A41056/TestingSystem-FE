import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider'; 

function UserDetail() {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();
  useEffect(() => {
  }, [selectedLanguage]);
  const { userId } = useParams();
  const [userData, setUserData] = useState({
    userName: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    birthDay: '1990-01-01', // Default value
    avatarUrl: ''
  });
  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

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
        // Convert ISO 8601 date to YYYY-MM-DD format
        userData.birthDay = userData.birthDay.slice(0, 10);
        setUserData(userData);
      } else {
        console.error('Failed to fetch user data:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setUserData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${BASE_URL}/User/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          Id: userId,
          FirstName: userData.firstName,
          LastName: userData.lastName,
          Email: userData.email,
          BirthDay: userData.birthDay,
          PhoneNumber: userData.phoneNumber,
          Gender: userData.gender,
        }),
      });
      if (response.ok) {
        alert('User information updated successfully!');
      } else {
        console.error('Failed to update user information:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating user information:', error);
    }
  };

  return (
    <div className="site-section">
      <div className="tab-content rounded-bottom">
        <div className="tab-pane p-3 active preview" role="tabpanel" id="preview-1003">
          <div className="col-12">
            <div className="card mb-4">
              <div className="card-header"><strong>{t('UserDetail')}</strong></div>
              <div className="card-body">
                <form className="row g-3" onSubmit={handleSubmit}>
                  <div className="col-md-4">
                    {/* Image */}
                    <img src={userData.avatarUrl} alt="User Avatar" className="img-fluid" style={{ width: '100%', borderRadius: '50%' }} />
                    {/* Change Avatar URL */}
                    <div className="mb-3">
                      <label className="form-label" htmlFor="inputAvatarUrl">{t('AvatarUrl')}</label>
                      <input className="form-control" id="inputAvatarUrl" type="text" name="avatarUrl" value={userData.avatarUrl} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="col-md-8">
                    {/* User Information */}
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label" htmlFor="inputUsername">{t('Username')}</label>
                        <input className="form-control" id="inputUsername" type="text" name="userName" value={userData.userName} readOnly />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label" htmlFor="inputBirthDay">{t('Birthday')}</label>
                        <input className="form-control" id="inputBirthDay" type="date" name="birthDay" value={userData.birthDay} onChange={handleChange} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label" htmlFor="inputFirstName">{t('FirstName')}</label>
                        <input className="form-control" id="inputFirstName" type="text" name="firstName" value={userData.firstName} onChange={handleChange} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label" htmlFor="inputLastName">{t('LastName')}</label>
                        <input className="form-control" id="inputLastName" type="text" name="lastName" value={userData.lastName} onChange={handleChange} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label" htmlFor="inputEmail">{t('Email')}</label>
                        <input className="form-control" id="inputEmail" type="email" name="email" value={userData.email} onChange={handleChange} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label" htmlFor="inputPhoneNumber">{t('PhoneNumber')}</label>
                        <input className="form-control" id="inputPhoneNumber" type="tel" name="phoneNumber" value={userData.phoneNumber} onChange={handleChange} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label" htmlFor="inputGender">{t('Gender')}</label>
                        <select className="form-select" id="inputGender" name="gender" value={userData.gender} onChange={handleChange}>
                          <option value="">{t('Choose')}...</option>
                          <option value="Male">{t('Male')}</option>
                          <option value="Female">{t('Female')}</option>
                          <option value="Other">{t('Other')}</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <Link className="btn btn-secondary me-2" to="/home">{t('Back')}</Link>
                        <button className="btn btn-primary" type="submit">{t('Save')}</button>
                      </div>
                    </div>
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

export default UserDetail;