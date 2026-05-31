import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { User, MapPin, FileText } from 'lucide-react';

export default function AuthorCard({ author }) {
  const { t } = useTranslation();
  const initials = (author.fullName || '?')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <article className="bg-white border border-line rounded-card p-5 hover:shadow-card transition-shadow">
      <div className="flex items-start gap-3">
        {author.avatar ? (
          <img
            src={author.avatar} alt=""
            className="w-12 h-12 rounded-full object-cover bg-muted"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary-50 text-primary font-semibold flex items-center justify-center">
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <Link to={`/authors/${author.slug}`}>
            <h3 className="font-semibold text-ink hover:text-primary transition truncate">
              {author.fullName}
            </h3>
          </Link>
          {author.affiliation && (
            <div className="text-xs text-sub flex items-center gap-1 mt-1 truncate">
              <User className="w-3 h-3 shrink-0" />
              <span className="truncate">{author.affiliation}</span>
            </div>
          )}
          {author.country && (
            <div className="text-xs text-sub flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" /> {author.country}
            </div>
          )}
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-line flex items-center justify-between text-xs">
        <span className="text-sub inline-flex items-center gap-1">
          <FileText className="w-3.5 h-3.5" />
          {author.articlesCount ?? 0} {t('author.articlesCount').toLowerCase()}
        </span>
        <Link to={`/authors/${author.slug}`} className="link-academic font-medium">
          {t('author.viewProfile')} →
        </Link>
      </div>
    </article>
  );
}
