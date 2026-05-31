import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useArchive } from '../hooks/useJournal';
import JournalIssueCard from '../components/JournalIssueCard';
import SkeletonCard from '../components/SkeletonCard';

export default function ArchivePage() {
  const { t } = useTranslation();
  const { data, isLoading } = useArchive();
  const grouped = data?.data || {};
  const years = Object.keys(grouped).sort((a, b) => b - a);

  return (
    <>
      <Helmet>
        <title>{t('archive.title')} — {t('site.name')}</title>
        <meta name="description" content={t('archive.subtitle')} />
      </Helmet>

      <div className="bg-surface border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink">{t('archive.title')}</h1>
          <p className="text-sub mt-2">{t('archive.subtitle')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} variant="issue" />)}
          </div>
        )}

        {!isLoading && years.length === 0 && (
          <p className="text-sub italic">{t('common.empty')}</p>
        )}

        {years.map((year) => (
          <section key={year}>
            <div className="flex items-baseline gap-3 mb-4 border-b border-line pb-2">
              <h2 className="font-serif text-2xl font-bold text-ink">{year}</h2>
              <span className="text-sm text-sub">{grouped[year].length} {t('archive.issues')}</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {grouped[year].map((issue) => (
                <JournalIssueCard key={issue._id} issue={issue} compact />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
