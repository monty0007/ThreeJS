import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (login(password)) {
            navigate('/admin');
        } else {
            setError('Invalid password');
        }
    };

    return (
        <section className="c-space my-20 flex items-center justify-center min-h-[60vh]">
            <div className="bg-black-300 p-8 rounded-xl border border-black-200 w-full max-w-md">
                <h2 className="head-text text-center mb-6">Admin Login</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            className="w-full bg-black-200 border border-black-100 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                            }}
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                        Login
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Login;
