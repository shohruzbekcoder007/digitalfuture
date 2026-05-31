import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();
  return (
    <footer className="bg-surface border-t border-line mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid sm:grid-cols-2 md:grid-cols-4 gap-6 text-sm">
        <div>
          <div className="font-serif font-bold text-base text-ink leading-snug">{t('site.name')}</div>
          <p className="mt-2 text-sub">{t('site.tagline')}</p>
          <p className="mt-2 text-xs text-sub">{t('site.issn')}</p>
        </div>
        <div>
          <div className="font-semibold text-ink mb-2">{t('nav.archive')}</div>
          <ul className="space-y-1 text-sub">
            <li><Link to="/current" className="hover:text-primary">{t('nav.current')}</Link></li>
            <li><Link to="/archive" className="hover:text-primary">{t('nav.archive')}</Link></li>
            <li><Link to="/articles" className="hover:text-primary">{t('nav.articles')}</Link></li>
            <li><Link to="/authors" className="hover:text-primary">{t('nav.authors')}</Link></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-ink mb-2">{t('footer.submissions')}</div>
          <ul className="space-y-1 text-sub">
            <li><a className="hover:text-primary" href="#">{t('footer.submissions')}</a></li>
            <li><a className="hover:text-primary" href="#">{t('footer.ethics')}</a></li>
            <li><a className="hover:text-primary" href="#">{t('footer.contact')}</a></li>
          </ul>
        </div>
        <div>
          <div className="font-semibold text-ink mb-2">{t('nav.about')}</div>
          <p className="text-sub leading-relaxed">
            Open access akademik nashr. Maqolalar CC-BY litsenziyasi ostida tarqatiladi.
          </p>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs text-sub flex justify-between">
          <span>© {year} {t('site.shortName')}</span>
          <span>{t('footer.rights')}</span>
        </div>
      </div>
    </footer>
  );
}
