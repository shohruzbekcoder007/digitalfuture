import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  const items = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(pages, start + 4);
  for (let i = start; i <= end; i++) items.push(i);

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="p-2 rounded-badge bg-white border border-gray-200 disabled:opacity-40 hover:border-primary hover:text-primary"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      {items.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={clsx(
            'min-w-[36px] h-9 rounded-badge text-sm font-medium',
            p === page
              ? 'bg-primary text-white'
              : 'bg-white border border-gray-200 hover:border-primary hover:text-primary'
          )}
        >
          {p}
        </button>
      ))}
      <button
        disabled={page === pages}
        onClick={() => onChange(page + 1)}
        className="p-2 rounded-badge bg-white border border-gray-200 disabled:opacity-40 hover:border-primary hover:text-primary"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
