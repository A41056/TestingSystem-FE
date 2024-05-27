import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserChangePassword() {
    const { t } = useTranslation();
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const [userName, setUserName] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChangePassword = async (event) => {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        const requestBody = {
            username: userName,
            oldPassword: oldPassword,
            newPassword: newPassword
        };

        try {
            const response = await fetch(`${BASE_URL}/Auth/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                setSuccess('Password reset successfully.');
                setError('');
                setUserName('');
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                toast.success('Password reset successfully');
            } else {
                toast.error('An error occurred while changing password');
                setSuccess('');
            }
        } catch (error) {
            toast.error('An error occurred while changing password');
            setSuccess('');
        }
    };

    return (
        <div className="site-section mt-5">
            <ToastContainer/>
            <div className="container">
                <h2 className="text-center mb-4">{t('ChangePassword')}</h2>
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="row justify-content-center">
                        <form onSubmit={handleChangePassword}>
                            <div className="col-md-12 form-group">
                                <label htmlFor="userName">{t('UserName')}</label>
                                <input
                                    type="text"
                                    id="userName"
                                    className="form-control form-control-lg"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-12 form-group">
                                <label htmlFor="oldPassword">{t('OldPassword')}</label>
                                <input
                                    type="password"
                                    id="oldPassword"
                                    className="form-control form-control-lg"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-12 form-group">
                                <label htmlFor="newPassword">{t('NewPassword')}</label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    className="form-control form-control-lg"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-12 form-group">
                                <label htmlFor="confirmPassword">{t('ConfirmPassword')}</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    className="form-control form-control-lg"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-12">
                                <div className="text-center">
                                    <button className="btn btn-link" onClick={() => navigate('/login')}>
                                        {t('Back')}
                                    </button>
                                    <button type="submit" className="btn btn-primary btn-lg px-5">
                                        {t('Change')}
                                    </button>
                                </div>
                            </div>
                        </form>
                        {error && (
                            <div className="col-md-12 text-danger text-center">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="col-md-12 text-success text-center">
                                {success}
                            </div>
                        )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserChangePassword;