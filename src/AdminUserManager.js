import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { useLanguage } from './LanguageProvider'; 

function AdminUserManager() {
  const { t } = useTranslation();
  const { selectedLanguage } = useLanguage();

  useEffect(() => {
  }, [selectedLanguage]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState({
    userName: '',
    gender: '',
  });

  const BASE_URL = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    fetchUsers();
  }, [filter]); // Refetch users when filters change

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');

      // Construct the API request URL based on the filter criteria
      let apiUrl = `${BASE_URL}/User/list`;
      let queryString = Object.keys(filter)
        .filter(key => filter[key] !== '')
        .map(key => `${key}=${filter[key]}`)
        .join('&');
      if (queryString) {
        apiUrl += `?${queryString}`;
      }

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userList = await response.json();
        setUsers(userList.data);
      } else {
        console.error('Failed to fetch users:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleChange = e => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Fetch users with updated filter values
    fetchUsers();
  };

  return (
    <div className="site-section">
          <div className="site-section">
      <div className="container-fluid">
        <div className="card mb-4">
          <div className="card-header">
            <strong>{t('Users')}</strong>
          </div>
          <div className="card-body">
            <form className="row g-3 align-items-center" onSubmit={handleSubmit}>
              <div className="col-auto">
                <label className="visually-hidden" htmlFor="userName">{t('Username')}</label>
                <input
                  className="form-control"
                  id="userName"
                  type="text"
                  placeholder="Search by username"
                  value={filter.userName}
                  name="userName"
                  onChange={handleChange}
                />
              </div>
              <div className="col-auto">
                <button className="btn btn-primary" type="submit">{t('Search')}</button>
              </div>
              <div className="col-auto">
                <Link to="/admin-create-user" className="btn btn-primary">{t('CreateUser')}</Link>
              </div>
            </form>
            <table className="table table-hover mt-3">
              {/* Table header */}
              <thead>
                <tr>
                  <th scope="col">{t('Number')}</th>
                  <th scope="col">{t('Username')}</th>
                  <th scope="col">{t('FirstName')}</th>
                  <th scope="col">{t('LastName')}</th>
                  <th scope="col">{t('Email')}</th>
                  <th scope="col">{t('PhoneNumber')}</th>
                  <th scope="col">{t('Gender')}</th>
                  <th scope="col">{t('Birthday')}</th>
                  <th scope="col">{t('Active')}</th>
                  <th scope="col">{t('Action')}</th>
                </tr>
              </thead>
              {/* Table body */}
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{user.userName}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{user.gender}</td>
                    <td>{user.birthDay}</td>
                    <td>{user.isActive ? 'Yes' : 'No'}</td>
                    <td>
                      <Link to={`/admin-edit-user/${user.id}`}>{t('Edit')}</Link>
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

export default AdminUserManager;
