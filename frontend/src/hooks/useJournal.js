import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as issuesSvc from '../services/issuesService';
import * as articlesSvc from '../services/articlesService';
import * as authorsSvc from '../services/authorsService';

export const useIssues = (params) =>
  useQuery({
    queryKey: ['issues', params],
    queryFn: () => issuesSvc.fetchIssues(params),
    keepPreviousData: true,
  });

export const useCurrentIssue = () =>
  useQuery({ queryKey: ['issues', 'current'], queryFn: issuesSvc.fetchCurrentIssue });

export const useArchive = () =>
  useQuery({ queryKey: ['issues', 'archive'], queryFn: issuesSvc.fetchArchive });

export const useIssue = (slug) =>
  useQuery({
    queryKey: ['issue', slug],
    queryFn: () => issuesSvc.fetchIssueBySlug(slug),
    enabled: Boolean(slug),
  });

export const useArticles = (params) =>
  useQuery({
    queryKey: ['articles', params],
    queryFn: () => articlesSvc.fetchArticles(params),
    keepPreviousData: true,
  });

export const useFeaturedArticles = () =>
  useQuery({ queryKey: ['articles', 'featured'], queryFn: articlesSvc.fetchFeaturedArticles });

export const useArticle = (slug) =>
  useQuery({
    queryKey: ['article', slug],
    queryFn: () => articlesSvc.fetchArticleBySlug(slug),
    enabled: Boolean(slug),
  });

export const useRelatedArticles = (slug) =>
  useQuery({
    queryKey: ['article', slug, 'related'],
    queryFn: () => articlesSvc.fetchRelatedArticles(slug),
    enabled: Boolean(slug),
  });

export const useAuthors = (params) =>
  useQuery({
    queryKey: ['authors', params],
    queryFn: () => authorsSvc.fetchAuthors(params),
    keepPreviousData: true,
  });

export const useAuthor = (slug) =>
  useQuery({
    queryKey: ['author', slug],
    queryFn: () => authorsSvc.fetchAuthorBySlug(slug),
    enabled: Boolean(slug),
  });

const invalidate = (qc, keys) => keys.forEach((k) => qc.invalidateQueries({ queryKey: [k] }));

export const useCreateIssue = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: issuesSvc.createIssue, onSuccess: () => invalidate(qc, ['issues', 'issue']) });
};
export const useUpdateIssue = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => issuesSvc.updateIssue(id, payload),
    onSuccess: () => invalidate(qc, ['issues', 'issue']),
  });
};
export const useDeleteIssue = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: issuesSvc.deleteIssue, onSuccess: () => invalidate(qc, ['issues']) });
};

export const useCreateArticle = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: articlesSvc.createArticle, onSuccess: () => invalidate(qc, ['articles', 'issue', 'article']) });
};
export const useUpdateArticle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => articlesSvc.updateArticle(id, payload),
    onSuccess: () => invalidate(qc, ['articles', 'article']),
  });
};
export const useDeleteArticle = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: articlesSvc.deleteArticle, onSuccess: () => invalidate(qc, ['articles']) });
};

export const useCreateAuthor = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: authorsSvc.createAuthor, onSuccess: () => invalidate(qc, ['authors']) });
};
export const useUpdateAuthor = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => authorsSvc.updateAuthor(id, payload),
    onSuccess: () => invalidate(qc, ['authors', 'author']),
  });
};
export const useDeleteAuthor = () => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: authorsSvc.deleteAuthor, onSuccess: () => invalidate(qc, ['authors']) });
};
