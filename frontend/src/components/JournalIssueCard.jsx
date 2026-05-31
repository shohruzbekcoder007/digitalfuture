import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Download, FileText, BookOpen } from 'lucide-react';
import { formatDate, pickLocalized } from '../utils/format';

export default function JournalIssueCard({ issue, compact = false }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.split('-')[0];
  const title = pickLocalized(issue.title, lang);
  const fallback = `https://picsum.photos/seed/${issue.slug}/600/800`;

  return (
    <article className="group bg-white border border-line rounded-card overflow-hidden hover:shadow-card transition-shadow flex flex-col">
      <Link to={`/issues/${issue.slug}`} className="block aspect-[3/4] bg-muted overflow-hidden relative">
        <img
          src={issue.coverImage || fallback}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
          onError={(e) => { e.currentTarget.src = fallback; }}
        />
        {issue.isCurrent && (
          <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-badge">
            {t('issue.current')}
          </span>
        )}
      </Link>
      <div className="p-4 flex-1 flex flex-col">
        <div className="text-xs font-semibold text-primary uppercase tracking-wider">
          {t('issue.volume')} {issue.volume} · {t('issue.issue')} {issue.issueNumber}
        </div>
        <Link to={`/issues/${issue.slug}`}>
          <h3 className="mt-1 font-serif font-semibold text-ink line-clamp-2 hover:text-primary transition">
            {title}
          </h3>
        </Link>
        <div className="mt-2 text-xs text-sub flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{formatDate(issue.publicationDate, lang)}</span>
          {issue.pages > 0 && <span className="text-line">·</span>}
          {issue.pages > 0 && <span>{issue.pages} {t('issue.pages')}</span>}
        </div>
        {!compact && (
          <div className="mt-3 pt-3 border-t border-line flex items-center gap-3 text-sm">
            <Link to={`/issues/${issue.slug}`} className="link-academic font-medium inline-flex items-center gap-1">
              <FileText className="w-4 h-4" /> {t('issue.viewIssue')}
            </Link>
            {issue.pdfUrl && (
              <a
                href={issue.pdfUrl} target="_blank" rel="noreferrer"
                className="text-sub hover:text-primary inline-flex items-center gap-1"
              >
                <Download className="w-4 h-4" /> PDF
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
