import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import FilterBar from '../components/FilterBar';
import ArticleCard from '../components/ArticleCard';
import SkeletonCard from '../components/SkeletonCard';
import Pagination from '../components/Pagination';
import useDebounce from '../hooks/useDebounce';
import { useArticles } from '../hooks/useJournal';

const DEFAULT = {
  search: '', category: 'all', language: 'all', year: '', sort: 'newest', page: 1, limit: 12,
};

export default function ArticlesPage() {
  const { t } = useTranslation();
  const [filters, setFilters] = useState(DEFAULT);
  const debouncedSearch = useDebounce(filters.search, 350);

  const params = { ...filters, search: debouncedSearch };
  const { data, isLoading, isFetching } = useArticles(params);
  const items = data?.data || [];
  const pagination = data?.pagination || { page: 1, pages: 1 };

  const years = useMemo(() => {
    const ys = new Set();
    items.forEach((a) => a.publicationDate && ys.add(new Date(a.publicationDate).getFullYear()));
    const current = new Date().getFullYear();
    for (let y = current; y >= current - 6; y--) ys.add(y);
    return [...ys].sort((a, b) => b - a);
  }, [items]);

  const onPage = (page) => {
    setFilters((f) => ({ ...f, page }));
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  return (
    <>
      <Helmet>
        <title>{t('nav.articles')} — {t('site.name')}</title>
        <meta name="description" content={t('site.tagline')} />
      </Helmet>

      <div className="bg-surface border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink">{t('nav.articles')}</h1>
          <p className="text-sub mt-2">{t('site.tagline')}</p>
        </div>
      </div>

      <FilterBar
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT)}
        years={years}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {(isLoading || isFetching) ? (
          <div className="grid md:grid-cols-2 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-3">📄</div>
            <p className="text-sub">{t('common.empty')}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {items.map((a) => <ArticleCard key={a._id} article={a} />)}
          </div>
        )}
        <Pagination page={pagination.page} pages={pagination.pages} onChange={onPage} />
      </div>
    </>
  );
}
