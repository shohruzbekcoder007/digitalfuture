import { Link, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BookOpen, Menu, X } from 'lucide-react';
import { useState } from 'react';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/current', label: t('nav.current') },
    { to: '/archive', label: t('nav.archive') },
    { to: '/articles', label: t('nav.articles') },
    { to: '/authors', label: t('nav.authors') },
  ];

  const navClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium transition relative ${
      isActive
        ? 'text-primary after:content-[""] after:absolute after:bottom-0 after:left-3 after:right-3 after:h-[2px] after:bg-primary'
        : 'text-ink/70 hover:text-primary'
    }`;

  return (
    <header className="bg-white sticky top-0 z-40 border-b border-line">
      <div className="bg-primary text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-8 flex items-center justify-between">
          <span className="opacity-90">{t('site.issn')}</span>
          <span className="opacity-90 hidden sm:inline">{t('site.tagline')}</span>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 text-ink hover:text-primary transition min-w-0">
          <div className="w-9 h-9 rounded bg-primary text-white flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="leading-tight min-w-0">
            <div className="font-serif font-bold text-base sm:text-[15px] lg:text-base tracking-tight line-clamp-1 max-w-[200px] sm:max-w-[320px] lg:max-w-none">
              <span className="hidden lg:inline">{t('site.name')}</span>
              <span className="lg:hidden">{t('site.shortName')}</span>
            </div>
            <div className="text-[10px] text-sub tracking-wider uppercase">Open Access · Peer-reviewed</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={navClass}>{l.label}</NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 rounded hover:bg-muted"
            aria-label="menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-line bg-white">
          <div className="max-w-7xl mx-auto px-4 py-2 flex flex-col">
            {links.map((l) => (
              <NavLink
                key={l.to} to={l.to} onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `py-2.5 text-sm ${isActive ? 'text-primary font-semibold' : 'text-ink/80'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
