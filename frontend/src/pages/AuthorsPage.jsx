import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { useAuthors } from '../hooks/useJournal';
import useDebounce from '../hooks/useDebounce';
import AuthorCard from '../components/AuthorCard';
import Pagination from '../components/Pagination';

export default function AuthorsPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debounced = useDebounce(search, 350);

  const { data, isLoading } = useAuthors({ search: debounced, page, limit: 24 });
  const items = data?.data || [];
  const pagination = data?.pagination || { page: 1, pages: 1 };

  return (
    <>
      <Helmet>
        <title>{t('nav.authors')} — {t('site.name')}</title>
      </Helmet>

      <div className="bg-surface border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink">{t('nav.authors')}</h1>
          <p className="text-sub mt-2">{t('author.publications')}</p>
          <div className="mt-5 relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sub" />
            <input
              value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder={t('common.search')}
              className="w-full pl-10 pr-3 py-2.5 rounded-card border border-line focus:border-primary outline-none text-sm bg-white"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-sub">{t('common.loading')}</div>
        ) : items.length === 0 ? (
          <p className="text-sub italic">{t('common.empty')}</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((a) => <AuthorCard key={a._id} author={a} />)}
          </div>
        )}
        <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} />
      </div>
    </>
  );
}
