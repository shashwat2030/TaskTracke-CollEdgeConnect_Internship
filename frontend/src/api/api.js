const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
//getting all tasks with filters

export const fetchTasks = async (filters = {}) => {
    try {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.priority) params.append('priority', filters.priority);
        if (filters.sort) params.append('sort', filters.sort);

        const response = await fetch(`${API_BASE_URL}/tasks?${params.toString()}`);

        if (!response.ok) throw new Error('Failed to fetch tasks');

        const data = await response.json();
        return data.data || [];

    } catch (error) {
        console.error('Fetch tasks error', error);
        throw error;

    }
};

// get single  task by ID

export const fetchTaskById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`);

        if (!response.ok) throw new Error('Task not found');

        const data = await response.json();
        return data.data;

    } catch (error) {
        console.error('Fetch task error', error);
        throw error;
    }
};
// post create task
export const createTask = async (taskData) => {
    try {


        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(taskData),
        });
        if (!response.ok) throw new Error('Failed to create task');

        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Create tasks error', error);
        throw error;
    }
};

// PUT update task

export const updateTask = async (id, taskData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(taskData),
        });

        if (!response.ok) throw new Error('Failed to update task');

        const data = await response.json();
        return data.data;

    } catch (error) {
        console.error('Update task error', error);
        throw error;
    }
};
// Delete task
export const deleteTask = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete task');

        return true;
    } catch (error) {
        console.error('Delete task error', error);
        throw error;
    }
};