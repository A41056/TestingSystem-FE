import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function Register() {
    const { t } = useTranslation();
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [gender, setGender] = useState('Male'); // Default value set to Male
    const [birthDay, setBirthDay] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (event) => {
        event.preventDefault();

        // Data filtering
        if (password.length < 6) {
            console.error('Password must be at least 6 characters long');
            return;
        }
        // Add more data filtering as needed...

        const requestBody = {
            username: username,
            password: password,
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNumber: phoneNumber,
            gender: gender,
            birthDay: birthDay
        };

        try {
            const response = await fetch(`${BASE_URL}/User/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                console.log('Registration successful');
                alert('Registration successful');
            } else {
                console.error('Registration failed');
                alert('Registration failed');
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    return (
        <div className="site-section">
            <div className="container">
                <h2 className="text-center mb-4">{t('WebUserSignUp')}</h2>
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <form onSubmit={handleRegister}>
                            <div className="form-group">
                                <label htmlFor="username">{t('Username')}</label>
                                <input type="text" id="username" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">{t('Password')}</label>
                                <input type="password" id="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="firstName">{t('FirstName')}</label>
                                <input type="text" id="firstName" className="form-control" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">{t('LastName')}</label>
                                <input type="text" id="lastName" className="form-control" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">{t('Email')}</label>
                                <input type="email" id="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phoneNumber">{t('PhoneNumber')}</label>
                                <input type="text" id="phoneNumber" className="form-control" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="gender">{t('Gender')}</label>
                                <select id="gender" className="form-control" value={gender} onChange={(e) => setGender(e.target.value)}>
                                    <option value="Male">{t('Male')}</option>
                                    <option value="Female">{t('Female')}</option>
                                    <option value="Other">{t('Other')}</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="birthDay">{t('DateofBirth')}</label>
                                <input type="date" id="birthDay" className="form-control" value={birthDay} onChange={(e) => setBirthDay(e.target.value)} />
                            </div>
                            <button className="btn btn-link" onClick={() => navigate('/login')}>
                                {t('Back')}
                            </button>
                            <button type="submit" className="btn btn-primary btn-block">{t('SignUp')}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;