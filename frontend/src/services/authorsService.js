import api from './api';

export const fetchAuthors = async (params = {}) => {
  const { data } = await api.get('/authors', { params });
  return data;
};

export const fetchAuthorBySlug = async (slug) => {
  const { data } = await api.get(`/authors/${slug}`);
  return data;
};

export const createAuthor = async (payload) => (await api.post('/authors', payload)).data;
export const updateAuthor = async (id, payload) => (await api.put(`/authors/${id}`, payload)).data;
export const deleteAuthor = async (id) => (await api.delete(`/authors/${id}`)).data;
