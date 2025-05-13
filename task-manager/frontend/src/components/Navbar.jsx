// frontend/src/components/Navbar.jsx (updated)
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function Navbar() {
    const { user, logout, isAuthenticated } = useContext(AuthContext);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    Task Manager
                </Link>

                <div className="navbar-links">
                    {isAuthenticated ? (
                        <>
              <span className="welcome-message">
                Welcome, {user?.username || 'User'}
              </span>
                            <button onClick={logout} className="logout-btn">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="nav-link">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;