import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Archive } from 'lucide-react';

export default function Hero() {
  const { t } = useTranslation();
  return (
    <section className="bg-gradient-to-b from-primary-50 to-white border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-primary mb-3">
            <span className="w-8 h-px bg-primary" />
            Peer-reviewed · Open Access
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-ink leading-tight">
            {t('hero.title')}
          </h1>
          <p className="mt-4 text-lg text-sub max-w-2xl">{t('hero.subtitle')}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/current"
              className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-card font-medium hover:bg-primary-600 transition"
            >
              {t('hero.viewCurrent')} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/archive"
              className="inline-flex items-center gap-2 bg-white text-ink border border-line px-5 py-2.5 rounded-card font-medium hover:border-primary hover:text-primary transition"
            >
              <Archive className="w-4 h-4" /> {t('hero.browseArchive')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
