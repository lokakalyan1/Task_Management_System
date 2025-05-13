// frontend/src/components/Login.jsx
import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
        const handleSubmit = async (e) => {
            e.preventDefault();

            if (!email || !password) {
                setError('Please fill in all fields');
                return;
            }

            try {
                setIsLoading(true);
                setError(null);

                const result = await login(email, password);

                if (result.success) {
                    navigate('/');
                } else {
                    setError(result.message);
                }
            } catch (err) {
                setError('An error occurred. Please try again.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        return (
            <div className="auth-container">
                <div className="auth-card">
                    <h2>Login to Task Manager</h2>

                    {error && <div className="auth-error">{error}</div>}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="auth-link">
                        Don't have an account? <Link to="/register">Register</Link>
                    </div>
                </div>
            </div>
        );
    }

    export default Login;