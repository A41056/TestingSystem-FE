import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminUserEdit() {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();

  useEffect(() => {
  }, [selectedLanguage]);
  const { userId } = useParams();
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    roleName: '',
    firstName: '',
    lastName: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    birthDay: '1990-01-01',
  });

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    // Fetch user data by userId when component mounts
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
          setFormData(userData);
        } else {
          console.error('Failed to fetch user data:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
          FirstName: formData.firstName,
          LastName: formData.lastName,
          Email: formData.email,
          BirthDay: formData.birthDay,
          PhoneNumber: formData.phoneNumber,
          Gender: formData.gender,
          RoleName: formData.roleName
        }),
      });
      if (response.ok) {
        toast.success('User information updated successfully!');
      } else {
        toast.error('Failed to update user information:', response.statusText);
      }
    } catch (error) {
      toast.error('Error updating user information:', error);
    }
  };

  return (
    <div className="site-section">
      <ToastContainer/>
        <div className="tab-content rounded-bottom">
      <div className="tab-pane p-3 active preview" role="tabpanel" id="preview-1003">
        <div className="col-12">
          <div className="card mb-4">
            <div className="card-header"><strong>{t('EDITUSER')}</strong></div>
            <div className="card-body">
              <form className="row g-3" onSubmit={handleSubmit}>
                {/* Your form inputs */}
                {/* Username */}
                <div className="col-md-6">
                    <label className="form-label" htmlFor="inputUsername">{t('Username')}</label>
                    <input className="form-control" id="inputUsername" type="text" name="userName" value={formData.userName} onChange={handleChange} />
                  </div>
                  {/* Password */}
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="inputPassword">{t('Password')}</label>
                    <input className="form-control" id="inputPassword" type="password" name="password" value={formData.password} onChange={handleChange} />
                  </div>
                  {/* First Name */}
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="inputFirstName">{t('FirstName')}</label>
                    <input className="form-control" id="inputFirstName" type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                  </div>
                  {/* Last Name */}
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="inputLastName">{t('LastName')}</label>
                    <input className="form-control" id="inputLastName" type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
                  </div>
                  {/* Role Name */}
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="inputRoleName">{t('RoleName')}</label>
                    <select className="form-select custom-select" id="inputRoleName" name="roleName" value={formData.roleName} onChange={handleChange}>
                      <option value="">{t('Choose')}...</option>
                      <option value="Admin">{t('Admin')}</option>
                      <option value="Teacher">{t('Teacher')}</option>
                      <option value="User">{t('User')}</option>
                    </select>
                  </div>
                  {/* Email */}
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="inputEmail">{t('Email')}</label>
                    <input className="form-control" id="inputEmail" type="email" name="email" value={formData.email} onChange={handleChange} />
                  </div>
                  {/* Phone Number */}
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="inputPhoneNumber">{t('PhoneNumber')}</label>
                    <input className="form-control" id="inputPhoneNumber" type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
                  </div>
                  {/* Gender */}
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="inputGender">{t('Gender')}</label>
                    <select className="form-select custom-select" id="inputGender" name="gender" value={formData.gender} onChange={handleChange}>
                      <option value="">{t('Choose')}...</option>
                      <option value="Male">{t('Male')}</option>
                      <option value="Female">{t('Female')}</option>
                      <option value="Other">{t('Other')}</option>
                    </select>
                  </div>
                  {/* Birthday */}
                  <div className="col-md-6">
                    <label className="form-label" htmlFor="inputBirthDay"></label>
                    <input className="form-control" id="inputBirthDay" type="date" name="birthDay" value={formData.birthDay} onChange={handleChange} />
                  </div>
                <div className="col-12">
                  <Link className="btn btn-secondary me-2" to="/admin-users">{t('Back')}</Link>
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

export default AdminUserEdit;
