import {useState} from "react";

export default function TaskForm({onSubmit, editingTask = null, isLoading = false, onCancel}) {
//State initializes cleanly and instantly from props.No side effect or tracking needed

    const [formData, setFormData] = useState({
        title: editingTask?.title || '',
        description: editingTask?.description || '',
        status: editingTask?.status || 'Pending',
        priority: editingTask?.priority || 'Medium',
        dueDate: editingTask?.dueDate ? editingTask.dueDate.split('T')[0] : ''
    });
    const [errors, setErrors] = useState({});


    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required ';
        } else if (formData.title.length > 100) {
            newErrors.title = 'Title should be less than 100 characters';

        }
        if (formData.description.length > 500) {
            newErrors.description = 'Description max 500 characters';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await onSubmit(formData);
        } catch (error) {
            console.error("Submit error:",error);
            throw error;
        }
    };


    return (
        <form onSubmit={handleSubmit} className="task-form">
            <h2>{editingTask ? 'Edit Task' : 'Create new Task'}</h2>

            <div className="form-group">
                <label htmlFor="title">Title *</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter task title"
                    disabled={isLoading}/>
                {errors.title && <span className="error">{errors.title}</span>}
            </div>


            <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter task description"
                    rows="4"
                    disabled={isLoading}/>
                {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="status">Status</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        disabled={isLoading}>
                        <option value="Pending">Pending</option>
                        <option value="In-Progress">In Progress</option>
                        <option value="Complete">Completed</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <select
                        id="priority"
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        disabled={isLoading}>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="dueDate">Due Date</label>
                    <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        value={formData.dueDate}
                        onChange={handleChange}
                        disabled={isLoading}/>
                </div>
            </div>

            <div className="form-actions">
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}>
                    {isLoading ? 'Saving...' : editingTask ? 'Update Task...' : 'Create Task'}
                </button>
                {editingTask && (
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={onCancel}// Hierarchical trigger:Tells  parent wipe the state
                        disabled={isLoading}>
                        Cancel</button>
                )}
            </div>
        </form>
    );


}