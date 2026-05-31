import { useTranslation } from 'react-i18next';
import { Search, X } from 'lucide-react';
import clsx from 'clsx';

const categories = ['all', 'research', 'review', 'case-study', 'editorial', 'short-communication'];
const languages = ['all', 'uz', 'ru', 'en'];
const sorts = ['newest', 'oldest', 'popular', 'downloads'];

export default function FilterBar({ filters, onChange, onReset, years = [] }) {
  const { t } = useTranslation();
  const set = (k, v) => onChange({ ...filters, [k]: v, page: 1 });

  return (
    <div className="bg-white border-b border-line sticky top-16 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sub" />
            <input
              value={filters.search || ''}
              onChange={(e) => set('search', e.target.value)}
              placeholder={t('filter.search')}
              className="w-full pl-10 pr-10 py-2.5 rounded-card border border-line focus:border-primary focus:ring-2 focus:ring-primary-50 outline-none text-sm"
            />
            {filters.search && (
              <button
                onClick={() => set('search', '')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sub hover:text-ink"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <select
            value={filters.language || 'all'}
            onChange={(e) => set('language', e.target.value)}
            className="py-2.5 px-3 rounded-card border border-line text-sm outline-none focus:border-primary bg-white"
          >
            {languages.map((l) => (
              <option key={l} value={l}>
                {l === 'all' ? t('filter.language') : l.toUpperCase()}
              </option>
            ))}
          </select>

          {years.length > 0 && (
            <select
              value={filters.year || ''}
              onChange={(e) => set('year', e.target.value)}
              className="py-2.5 px-3 rounded-card border border-line text-sm outline-none focus:border-primary bg-white"
            >
              <option value="">{t('filter.year')}</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          )}

          <select
            value={filters.sort || 'newest'}
            onChange={(e) => set('sort', e.target.value)}
            className="py-2.5 px-3 rounded-card border border-line text-sm outline-none focus:border-primary bg-white"
          >
            {sorts.map((s) => <option key={s} value={s}>{t(`sort.${s}`)}</option>)}
          </select>

          <button
            onClick={onReset}
            className="text-sm text-sub hover:text-primary px-2"
          >
            {t('filter.reset')}
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 no-scrollbar overflow-x-auto">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => set('category', c)}
              className={clsx(
                'px-3 py-1.5 rounded-badge text-xs font-medium border transition whitespace-nowrap',
                (filters.category || 'all') === c
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-ink/70 border-line hover:border-primary hover:text-primary'
              )}
            >
              {c === 'all' ? t('filter.all') : t(`category.${c}`)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
