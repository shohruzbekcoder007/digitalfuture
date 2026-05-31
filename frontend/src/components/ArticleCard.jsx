import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, Download, FileText } from 'lucide-react';
import clsx from 'clsx';
import { pickLocalized, formatDate } from '../utils/format';
import { categoryColors } from '../utils/badges';

export default function ArticleCard({ article, variant = 'list' }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.split('-')[0];
  const title = pickLocalized(article.title, lang);
  const abstract = pickLocalized(article.abstract, lang);
  const authorList = (article.authors || []).map((a) => a.fullName || a).filter(Boolean);

  return (
    <article
      className={clsx(
        'bg-white border border-line rounded-card p-5 hover:shadow-card transition-shadow',
        variant === 'compact' && 'p-4'
      )}
    >
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className={clsx(
          'inline-flex items-center px-2 py-0.5 rounded-badge text-[11px] font-semibold border',
          categoryColors[article.category] || categoryColors.other
        )}>
          {t(`category.${article.category}`)}
        </span>
        {article.issue && (
          <span className="text-xs text-sub">
            {t('issue.volume')} {article.issue.volume} · {t('issue.issue')} {article.issue.issueNumber} ({new Date(article.publicationDate).getFullYear()})
          </span>
        )}
        {article.language && (
          <span className="text-xs text-sub uppercase">· {article.language}</span>
        )}
      </div>

      <Link to={`/articles/${article.slug}`}>
        <h3 className="font-serif font-semibold text-ink text-lg leading-snug hover:text-primary transition line-clamp-2">
          {title}
        </h3>
      </Link>

      {authorList.length > 0 && (
        <div className="mt-2 text-sm text-sub line-clamp-1">
          {authorList.map((name, i) => (
            <span key={i}>
              {typeof article.authors?.[i] === 'object' && article.authors[i]?.slug ? (
                <Link to={`/authors/${article.authors[i].slug}`} className="link-academic">
                  {name}
                </Link>
              ) : (
                name
              )}
              {i < authorList.length - 1 && ', '}
            </span>
          ))}
        </div>
      )}

      {variant !== 'compact' && abstract && (
        <p className="mt-3 text-sm text-sub line-clamp-3">{abstract}</p>
      )}

      {article.keywords?.length > 0 && variant !== 'compact' && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {article.keywords.slice(0, 5).map((k) => (
            <span key={k} className="text-[11px] bg-muted text-sub px-2 py-0.5 rounded-badge">
              {k}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-line flex items-center justify-between text-xs text-sub">
        <div className="flex items-center gap-3">
          {article.pages && <span>pp. {article.pages}</span>}
          {article.doi && <span className="truncate max-w-[200px]">DOI: {article.doi}</span>}
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1"><Eye className="w-3 h-3" />{article.views || 0}</span>
          <span className="inline-flex items-center gap-1"><Download className="w-3 h-3" />{article.downloads || 0}</span>
          <Link to={`/articles/${article.slug}`} className="link-academic font-medium inline-flex items-center gap-1">
            <FileText className="w-3 h-3" /> {t('article.readMore')}
          </Link>
        </div>
      </div>
    </article>
  );
}
