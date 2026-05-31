import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Book, FileText, Users, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!localStorage.getItem('token')) return <Navigate to="/login" replace />;

  const links = [
    { to: '/admin/issues', label: t('admin.issues'), icon: <Book className="w-4 h-4" /> },
    { to: '/admin/articles', label: t('admin.articles'), icon: <FileText className="w-4 h-4" /> },
    { to: '/admin/authors', label: t('admin.authors'), icon: <Users className="w-4 h-4" /> },
  ];

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-ink">{t('admin.title')}</h1>
        <button onClick={logout}
          className="inline-flex items-center gap-2 text-sm text-sub hover:text-rose-500 border border-line px-3 py-2 rounded-card">
          <LogOut className="w-4 h-4" /> {t('admin.logout')}
        </button>
      </div>
      <nav className="flex gap-1 border-b border-line mb-6">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to}
            className={({ isActive }) =>
              `inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px ${
                isActive ? 'border-primary text-primary' : 'border-transparent text-sub hover:text-primary'
              }`
            }
          >
            {l.icon} {l.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}
