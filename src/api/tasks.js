import axios from 'axios';

const API_BASE = 'https://n3n683ud0i.execute-api.ap-southeast-2.amazonaws.com/prod';
const DEMO_USER = 'b3538f20-89a3-4eeb-8d36-22060a8a2721';

const api = axios.create({ baseURL: API_BASE });

export const fetchTasks = (filters = {}) =>
  api.get('/tasks', { params: { userId: DEMO_USER, ...filters } })
    .then(r => r.data);

export const createTask = (data) =>
  api.post('/tasks', { ...data, userId: DEMO_USER })
    .then(r => r.data);

export const updateTask = (id, data) =>
  api.put(`/tasks/${id}`, data).then(r => r.data);

export const deleteTask = (id) =>
  api.delete(`/tasks/${id}`);