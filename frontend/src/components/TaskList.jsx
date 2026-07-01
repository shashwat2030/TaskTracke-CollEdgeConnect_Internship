import {useState} from "react";

export default function TaskList({
                                     tasks = [],
                                     onEdit,
                                     onDelete,
                                     onFilterChange,
                                     isLoading = false
                                 }) {
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        sort: 'newest'
    });

    const handleFilterChange = (name, value) => {
        const newFilters = {...filters, [name]: value};
        setFilters(newFilters);
        onFilterChange(newFilters);
    };
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high' :
                return '#e74c3c';
            case 'medium' :
                return '#f39c12';
            case 'low':
                return '#27ae60';
            default:
                return '#95a5a6';
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return '#e74c3c';
            case 'in-progress':
                return '#f39c12';
            case 'complete':
                return '#27ae60';
            default:
                return '#95a5a6';
        }
    };
    const formatDate = (dateString) => {
        if (!dateString) return 'no date';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    const handleDelete = (id, title) => {
        if (window.confirm(`Delete "${title}"?`)) {
            onDelete(id);
        }
    };
    return (
        <div className="task-list-containers">
            <div className="task-filters">
                <h3>Filter Tasks</h3>


                <div className="filters-row">
                    <div className="filters-group">
                        <label htmlFor="status-filter">Status</label>
                        <select
                            id="status-filter"
                            value={filters.status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}>
                            <option value=""> All Status</option>
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="complete"> Completed</option>
                        </select>
                    </div>

                    <div className="filters-group">
                        <label htmlFor="priority-filter">Priority</label>
                        <select
                            id="priority-filter"
                            value={filters.priority}
                            onChange={(e) => handleFilterChange('priority', e.target.value)}>
                            <option value="">All Priority</option>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="sort-filter">Sort by</label>
                        <select
                            id="sort-filter"
                            value={filters.sort}
                            onChange={(e) => handleFilterChange('sort', e.target.value)}>
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>
                </div>
            </div>


            <div className="tasks-section">

                {isLoading ? (<div className="loading"> Loading tasks...</div>) : tasks.length === 0 ? (
                    <div className="empty-state"><p> No task found. Create one to get Started!</p></div>) : (
                    <div className="tasks-grid">
                        {tasks.map(task => (<div key={task._id} className="task-card">
                                <div className="task-header"><h3>{task.title}</h3>

                                    <div className="task-badges">
                                        <span className="badge priority-badge"
                                              style={{backgroundColor: getPriorityColor(task.priority)}}>{task.priority}</span>
                                        <span className="badge status-badge"
                                              style={{backgroundColor: getStatusColor(task.status)}}>{task.status}</span>
                                    </div>

                                </div>
                                {task.description && (<p className="task-description">{task.description}</p>)}
                                <div className="task-meta">
                                    <div className="meta-item">
                                        <span className="meta-label">Due:</span>
                                        <span className="meta-value">{formatDate(task.createdAt)}</span>
                                    </div>
                                </div>
                                <div className="task-actions">
                                    <button className="btn btn-sm btn-edit" onClick={() => onEdit(task)}>Edit</button>
                                    <button className="btn btn-sm btn-delete"
                                            onClick={() => handleDelete(task._id, task.title)}>Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

}