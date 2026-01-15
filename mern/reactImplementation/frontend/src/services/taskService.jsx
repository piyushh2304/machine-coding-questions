import api from './api';

export const getTasks = (page = 1, search = '', status = '', priority = '', limit = 6) =>
    api.get(`/tasks?page=${page}&search=${search}&status=${status}&priority=${priority}&limit=${limit}`);
export const createTask = (taskData) => api.post('/tasks', taskData);
export const updateTask = (id, taskData) => api.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);