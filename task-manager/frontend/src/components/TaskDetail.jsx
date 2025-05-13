// frontend/src/components/TaskDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function TaskDetail({ updateTask, deleteTask }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('pending');
    const [priority, setPriority] = useState('medium');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        fetchTask();
    }, [id]);

    const fetchTask = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`http://localhost:5000/api/tasks/${id}`);
            setTask(response.data);

            // Set form data
            setTitle(response.data.title);
            setDescription(response.data.description || '');
            setStatus(response.data.status);
            setPriority(response.data.priority);
            setDueDate(response.data.dueDate ? new Date(response.data.dueDate).toISOString().split('T')[0] : '');

            setError(null);
        } catch (err) {
            setError('Failed to fetch task details');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedTask = {
            title,
            description,
            status,
            priority,
            dueDate: dueDate || null
        };

        const result = await updateTask(id, updatedTask);
        if (result) {
            setTask(result);
            setIsEditing(false);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm('Are you sure you want to delete this task?');
        if (confirmed) {
            const result = await deleteTask(id);
            if (result) {
                navigate('/');
            }
        }
    };

    if (isLoading) {
        return <div className="loading">Loading task details...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!task) {
        return <div className="not-found">Task not found</div>;
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'No due date';
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className="task-detail">
            {!isEditing ? (
                <>
                    <div className="task-detail-header">
                        <h2>{task.title}</h2>
                        <div className="task-detail-actions">
                            <button onClick={() => setIsEditing(true)} className="edit-btn">Edit</button>
                            <button onClick={handleDelete} className="delete-btn">Delete</button>
                        </div>
                    </div>

                    <div className="task-detail-info">
                        <div className="task-info-item">
                            <span className="info-label">Status:</span>
                            <span className={`status-badge ${task.status}`}>{task.status}</span>
                        </div>

                        <div className="task-info-item">
                            <span className="info-label">Priority:</span>
                            <span className={`priority-badge ${task.priority}`}>{task.priority}</span>
                        </div>

                        <div className="task-info-item">
                            <span className="info-label">Due Date:</span>
                            <span>{formatDate(task.dueDate)}</span>
                        </div>

                        <div className="task-info-item">
                            <span className="info-label">Created:</span>
                            <span>{new Date(task.createdAt).toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="task-description">
                        <h3>Description</h3>
                        <p>{task.description || 'No description provided'}</p>
                    </div>

                    <button onClick={() => navigate('/')} className="back-btn">Back to Tasks</button>
                </>
            ) : (
                <form onSubmit={handleSubmit} className="task-edit-form">
                    <h2>Edit Task</h2>

                    <div className="form-group">
                        <label htmlFor="title">Title:</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows="3"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="status">Status:</label>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="priority">Priority:</label>
                            <select
                                id="priority"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="dueDate">Due Date:</label>
                        <input
                            type="date"
                            id="dueDate"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-btn">Save Changes</button>
                        <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default TaskDetail;