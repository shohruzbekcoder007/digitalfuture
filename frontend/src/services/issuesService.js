import api from './api';

export const fetchIssues = async (params = {}) => {
  const { data } = await api.get('/issues', { params });
  return data;
};

export const fetchCurrentIssue = async () => {
  const { data } = await api.get('/issues/current');
  return data;
};

export const fetchArchive = async () => {
  const { data } = await api.get('/issues/archive');
  return data;
};

export const fetchIssueBySlug = async (slug) => {
  const { data } = await api.get(`/issues/${slug}`);
  return data;
};

export const incrementIssueView = (id) => api.patch(`/issues/${id}/view`);
export const incrementIssueDownload = (id) => api.patch(`/issues/${id}/download`);

export const createIssue = async (payload) => (await api.post('/issues', payload)).data;
export const updateIssue = async (id, payload) => (await api.put(`/issues/${id}`, payload)).data;
export const deleteIssue = async (id) => (await api.delete(`/issues/${id}`)).data;
