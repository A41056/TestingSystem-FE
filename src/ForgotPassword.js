import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const { t } = useTranslation();
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
    const navigate = useNavigate();
    const BASE_URL = process.env.REACT_APP_BASE_URL;

    const handleResetPassword = async (event) => {
        event.preventDefault();

        // Validate email
        if (!email) {
            setEmailError('Please enter your email');
            return;
        }

        try {
            // Make API call to send password reset link
            const response = await fetch(`${BASE_URL}/Auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                setResetPasswordSuccess(true);
            } else {
                setEmailError('Failed to send reset password link. Please try again later.');
            }
        } catch (error) {
            console.error('Error sending reset password link:', error);
            setEmailError('An error occurred while sending the reset password link.');
        }
    };

    return (
        <div className="site-section mt-5">
            <div className="container">
                <h2 className="text-center mb-4">{t('ForgotPassword')}</h2>
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="row justify-content-center">
                            <form onSubmit={handleResetPassword}>
                                <div className="col-md-12 form-group">
                                    <label htmlFor="email">{t('Email')}</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="form-control form-control-lg"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                {emailError && <div className="col-12 text-danger mb-3">{emailError}</div>}
                                {resetPasswordSuccess && (
                                    <div className="col-12 text-success mb-3">
                                        {t('SendMailNotification')}
                                    </div>
                                )}
                                <div className="col-12">
                                    <div className="text-center">
                                        <button type="submit" className="btn btn-primary btn-lg px-5">
                                            {t('Send')}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center mt-3">
                    <div className="col-md-5">
                        <p className="text-center">
                            <button className="btn btn-link" onClick={() => navigate('/login')}>
                                {t('Back')}
                            </button>
                            <button className="btn btn-link" onClick={() => navigate('/change-password')}>
                                {t('ChangePassword')}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;