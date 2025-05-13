// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskDetail from './components/TaskDetail';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import AuthContext from './context/AuthContext';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            fetchUserProfile();
            fetchTasks();
        } else {
            setIsLoading(false);
        }
    }, [token]);

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get(`${API_URL}/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
        } catch (err) {
            console.error('Failed to fetch user profile:', err);
            logout();
        }
    };

    const fetchTasks = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_URL}/tasks`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch tasks');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            });
            localStorage.setItem('token', response.data.token);
            setToken(response.data.token);
            setUser(response.data.user);
            return { success: true };
        } catch (err) {
            console.error('Login error:', err);
            return {
                success: false,
                message: err.response?.data?.message || 'Login failed'
            };
        }
    };

    const register = async (username, email, password) => {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, {
                username,
                email,
                password
            });
            localStorage.setItem('token', response.data.token);
            setToken(response.data.token);
            setUser(response.data.user);
            return { success: true };
        } catch (err) {
            console.error('Registration error:', err);
            return {
                success: false,
                message: err.response?.data?.message || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setTasks([]);
    };

    const addTask = async (task) => {
        try {
            const response = await axios.post(`${API_URL}/tasks`, task, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks([response.data, ...tasks]);
            return response.data;
        } catch (err) {
            setError('Failed to add task');
            console.error(err);
            return null;
        }
    };

    const updateTask = async (id, updatedTask) => {
        try {
            const response = await axios.put(`${API_URL}/tasks/${id}`, updatedTask, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(tasks.map(task => task._id === id ? response.data : task));
            return response.data;
        } catch (err) {
            setError('Failed to update task');
            console.error(err);
            return null;
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`${API_URL}/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(tasks.filter(task => task._id !== id));
            return true;
        } catch (err) {
            setError('Failed to delete task');
            console.error(err);
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated: !!token }}>
            <Router>
                <div className="app">
                    <Navbar />
                    {error && <div className="error-message">{error}</div>}
                    <Routes>
                        <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />
                        <Route path="/register" element={!token ? <Register /> : <Navigate to="/" />} />
                        <Route path="/" element={
                            token ? (
                                <>
                                    <TaskForm addTask={addTask} />
                                    <TaskList
                                        tasks={tasks}
                                        isLoading={isLoading}
                                        deleteTask={deleteTask}
                                        updateTask={updateTask}
                                    />
                                </>
                            ) : <Navigate to="/login" />
                        } />
                        <Route path="/task/:id" element={
                            token ? (
                                <TaskDetail
                                    tasks={tasks}
                                    updateTask={updateTask}
                                    deleteTask={deleteTask}
                                />
                            ) : <Navigate to="/login" />
                        } />
                    </Routes>
                </div>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;