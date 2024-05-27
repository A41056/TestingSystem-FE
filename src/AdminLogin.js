import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Import jwt_decode
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminLogin({ onLoginSuccess }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const BASE_URL = process.env.REACT_APP_BASE_URL;
    const handleLogin = async (event) => {
        event.preventDefault();

        // Form validation
        if (!username || !password) {
            setError('Please enter both username and password');
            return;
        }

        try {
            // Make API call to your ASP.NET backend
            const response = await fetch(`${BASE_URL}/Auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
        
            if (response.ok) {
                const token = await response.text(); // Extract token from response
                const decodedToken = jwtDecode(token); // Decode the token
                const { given_name: username, role: roleId} = decodedToken;
                console.log(decodedToken);
                console.log(token);
                localStorage.setItem('token', token);

                if (roleId ==='Admin' || roleId === 'Teacher') {
                    onLoginSuccess(username, token);
                    navigate('/admin-home'); 
                } else if (roleId === 'User') {
                    onLoginSuccess(username, token);
                    navigate('/'); 
                }else{
                    toast.error('Invalid username or password');
                }

            } else {
                // Handle login failure
                toast.error('Invalid username or password');
            }
        } catch (error) {
            toast.error('Error during login:', error);
        }
    };

    return (
        <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
            <ToastContainer/>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card-group d-block d-md-flex row">
                            <div className="card col-md-7 p-4 mb-0">
                                <div className="card-body">
                                    <h1>Login</h1>
                                    <p className="text-medium-emphasis">Sign In to your account</p>
                                    <form onSubmit={handleLogin}>
                                        <div className="input-group mb-3">
                                            <span className="input-group-text"></span>
                                            <input
                                                className="form-control"
                                                type="text"
                                                placeholder="Username"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                            />
                                        </div>
                                        <div className="input-group mb-4">
                                            <span className="input-group-text"></span>
                                            <input
                                                className="form-control"
                                                type="password"
                                                placeholder="Password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </div>
                                        {error && <div className="text-danger mb-3">{error}</div>}
                                        <div className="row">
                                            <div className="col-6">
                                                <button className="btn btn-primary px-4" type="submit">Login</button>
                                            </div>
                                            <div className="col-6 text-end">
                                                <button className="btn btn-link px-0" type="button">Forgot password?</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                            <div className="card col-md-5 text-white bg-primary py-5">
                                <div className="card-body text-center">
                                    <div>
                                        <h2>Sign up</h2>
                                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                        <button className="btn btn-lg btn-outline-light mt-3" type="button">Register Now!</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;
