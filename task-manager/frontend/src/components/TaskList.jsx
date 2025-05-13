// frontend/src/components/TaskList.jsx
import { Link } from 'react-router-dom';

function TaskList({ tasks, isLoading, deleteTask, updateTask }) {
    if (isLoading) {
        return <div className="loading">Loading tasks...</div>;
    }

    if (tasks.length === 0) {
        return <div className="no-tasks">No tasks found. Add a new task!</div>;
    }

    const handleStatusChange = (id, newStatus) => {
        updateTask(id, { status: newStatus });
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'pending': return 'status-pending';
            case 'in-progress': return 'status-in-progress';
            case 'completed': return 'status-completed';
            default: return '';
        }
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'high': return 'priority-high';
            case 'medium': return 'priority-medium';
            case 'low': return 'priority-low';
            default: return '';
        }
    };

    return (
        <div className="task-list">
            <h2>Your Tasks</h2>
            {tasks.map((task) => (
                <div key={task._id} className={`task-item ${getStatusClass(task.status)}`}>
                    <div className="task-header">
                        <h3>
                            <Link to={`/task/${task._id}`}>{task.title}</Link>
                        </h3>
                        <span className={`task-priority ${getPriorityClass(task.priority)}`}>
              {task.priority}
            </span>
                    </div>

                    <div className="task-description">{task.description}</div>

                    <div className="task-footer">
                        <div className="task-status">
                            <select
                                value={task.status}
                                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                className={getStatusClass(task.status)}
                            >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div className="task-actions">
                            <button
                                onClick={() => deleteTask(task._id)}
                                className="delete-btn"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default TaskList;