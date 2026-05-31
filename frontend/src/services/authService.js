import api from './api';

export const login = async (credentials) => (await api.post('/auth/login', credentials)).data;
export const register = async (payload) => (await api.post('/auth/register', payload)).data;
export const fetchMe = async () => (await api.get('/auth/me')).data;
