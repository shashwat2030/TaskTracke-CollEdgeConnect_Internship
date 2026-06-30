import {useState, useEffect, useCallback} from 'react';
import TaskForm from '../components/TaskForm.jsx';
import TaskList from '../components/TaskList.jsx';
import {fetchTasks, createTask, updateTask, deleteTask} from '../api/api.js';

export default function Home() {
    const [tasks, setTasks] = useState([]);
    const [editingTask, setEditingTask] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({});



    const fetchTasksData = useCallback(async (filterData = {}) => {
        return await fetchTasks(filterData);
    }, []);

    useEffect(() => {
        let isMounted=true;
        const loadTasks = async () => {
            setLoading(true);
            setError(null);
            try{
                const tasks= await fetchTasksData();
                if(isMounted){
                    setTasks(tasks);
                }
            }
            catch(error){
                if(isMounted){
                    setError('Failed to load tasks. Please try again later.');
                }
                console.error(error);
            }
            finally {
                if(isMounted){
                        setLoading(false);
                }
            }
        };
        loadTasks();
        return () => {
            isMounted=false;
        }
    },[fetchTasksData]);

    const handleCreateOrUpdate = async (formData) => {
        setLoading(true);
        setError(null);
        try {
            if (editingTask) {
                await updateTask(editingTask._id, formData);
                setEditingTask(null);
            } else {
                await createTask(formData);
            }

            const updatedTasks = await fetchTasksData(filters);
            setTasks(updatedTasks);
        } catch (err) {
            setError(editingTask ? 'Failed to update task.' : 'Failed to create task.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    const handleDelete = async (id) => {
        setLoading(true);
        setError(null);
        try {
            await deleteTask(id);
            const updatedTasks = await fetchTasksData(filters);
            setTasks(updatedTasks);
        } catch (err) {
            setError('Failed to delete task.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = useCallback((newFilters) => {
        setFilters(newFilters);


        // ✅ Immediately invoked async function - no ignored promise
        (async () => {
            setLoading(true);
            try {
                const filteredTasks = await fetchTasksData(newFilters);
                setTasks(filteredTasks);
            } catch (err) {
                setError('Failed to apply filters.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        })();
    }, [fetchTasksData]);

    return (
        <div className="home-page">
            <header className="app-header">
                <div className="header-content">
                    <h1>Task Tracker</h1>
                    <p>Manage your tasks efficiently with ease</p>
                </div>
            </header>

            <main className="main-content">
                <div className="container">
                    {error && (
                        <div className="alert alert-error" role="alert">
                            {error}
                            <button
                                className="alert-close"
                                onClick={() => setError(null)}
                                aria-label="Close error"
                            >
                                ×
                            </button>
                        </div>
                    )}

                    <div className="layout">
                        <div className="form-section">
                            <TaskForm
                                key={editingTask ? editingTask._id : 'new-task'}
                                onSubmit={handleCreateOrUpdate}
                                editingTask={editingTask}
                                isLoading={loading}
                                onCancel={() => setEditingTask(null)}
                            />
                        </div>

                        <div className="list-section">
                            <TaskList
                                tasks={tasks}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onFilterChange={handleFilterChange}
                                isLoading={loading}
                            />
                        </div>
                    </div>
                </div>
            </main>

            <footer className="app-footer">
                <p>&copy; 2026 Task Tracker. Built with React + Node.js</p>
            </footer>
        </div>
    );
}