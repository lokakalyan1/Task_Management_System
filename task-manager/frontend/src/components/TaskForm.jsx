// frontend/src/components/TaskForm.jsx
import { useState } from 'react';

function TaskForm({ addTask }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    const [dueDate, setDueDate] = useState('');
    const [isFormVisible, setIsFormVisible] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        const newTask = {
            title,
            description,
            priority,
            dueDate: dueDate || null
        };

        addTask(newTask);
        resetForm();
    };

    const resetForm = () => {
        setTitle('');
        setDescription('');
        setPriority('medium');
        setDueDate('');
        setIsFormVisible(false);
    };

    return (
        <div className="task-form-container">
            {!isFormVisible ? (
                <button
                    className="add-task-btn"
                    onClick={() => setIsFormVisible(true)}
                >
                    + Add New Task
                </button>
            ) : (
                <form onSubmit={handleSubmit} className="task-form">
                    <h2>Add New Task</h2>

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

                        <div className="form-group">
                            <label htmlFor="dueDate">Due Date:</label>
                            <input
                                type="date"
                                id="dueDate"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="submit-btn">Add Task</button>
                        <button type="button" className="cancel-btn" onClick={resetForm}>Cancel</button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default TaskForm;
