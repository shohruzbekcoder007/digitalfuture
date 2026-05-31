import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CurrentIssuePage from './pages/CurrentIssuePage';
import ArchivePage from './pages/ArchivePage';
import IssueDetailPage from './pages/IssueDetailPage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import AuthorsPage from './pages/AuthorsPage';
import AuthorDetailPage from './pages/AuthorDetailPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLayout from './pages/admin/AdminLayout';
import AdminIssuesPage from './pages/admin/AdminIssuesPage';
import AdminArticlesPage from './pages/admin/AdminArticlesPage';
import AdminAuthorsPage from './pages/admin/AdminAuthorsPage';
import { Navigate } from 'react-router-dom';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/current" element={<CurrentIssuePage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/issues/:slug" element={<IssueDetailPage />} />
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:slug" element={<ArticleDetailPage />} />
        <Route path="/authors" element={<AuthorsPage />} />
        <Route path="/authors/:slug" element={<AuthorDetailPage />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="issues" replace />} />
          <Route path="issues" element={<AdminIssuesPage />} />
          <Route path="articles" element={<AdminArticlesPage />} />
          <Route path="authors" element={<AdminAuthorsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
