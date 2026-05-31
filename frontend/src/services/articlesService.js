import api from './api';

export const fetchArticles = async (params = {}) => {
  const { data } = await api.get('/articles', { params });
  return data;
};

export const fetchFeaturedArticles = async () => {
  const { data } = await api.get('/articles/featured');
  return data;
};

export const fetchArticleBySlug = async (slug) => {
  const { data } = await api.get(`/articles/${slug}`);
  return data;
};

export const fetchRelatedArticles = async (slug) => {
  const { data } = await api.get(`/articles/${slug}/related`);
  return data;
};

export const incrementArticleView = (id) => api.patch(`/articles/${id}/view`);
export const incrementArticleDownload = (id) => api.patch(`/articles/${id}/download`);

export const createArticle = async (payload) => (await api.post('/articles', payload)).data;
export const updateArticle = async (id, payload) => (await api.put(`/articles/${id}`, payload)).data;
export const deleteArticle = async (id) => (await api.delete(`/articles/${id}`)).data;
