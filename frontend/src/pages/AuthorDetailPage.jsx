import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { ChevronRight, User, MapPin, Mail, ExternalLink } from 'lucide-react';
import { useAuthor } from '../hooks/useJournal';
import { pickLocalized } from '../utils/format';
import ArticleCard from '../components/ArticleCard';

export default function AuthorDetailPage() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language.split('-')[0];
  const { data, isLoading } = useAuthor(slug);

  if (isLoading) return <div className="max-w-5xl mx-auto px-4 py-12 text-sub">{t('common.loading')}</div>;
  const author = data?.data?.author;
  const articles = data?.data?.articles || [];
  if (!author) return <div className="max-w-5xl mx-auto px-4 py-12 text-sub italic">{t('common.empty')}</div>;

  const bio = pickLocalized(author.bio, lang);
  const initials = (author.fullName || '?').split(' ').map((s) => s[0]).slice(0, 2).join('');

  return (
    <>
      <Helmet>
        <title>{author.fullName} — {t('site.name')}</title>
        <meta name="description" content={bio.slice(0, 160)} />
      </Helmet>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center gap-2 text-sm text-sub mb-6">
          <Link to="/" className="hover:text-primary">{t('nav.home')}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/authors" className="hover:text-primary">{t('nav.authors')}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-ink truncate">{author.fullName}</span>
        </nav>

        <header className="bg-surface border border-line rounded-card p-6 flex flex-col sm:flex-row gap-5 items-start">
          {author.avatar ? (
            <img src={author.avatar} alt="" className="w-24 h-24 rounded-full object-cover" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-primary-50 text-primary font-bold text-2xl flex items-center justify-center">
              {initials}
            </div>
          )}
          <div className="flex-1">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-ink">{author.fullName}</h1>
            <div className="mt-2 grid sm:grid-cols-2 gap-y-1 text-sm text-sub">
              {author.affiliation && (
                <div className="flex items-center gap-2"><User className="w-4 h-4" />{author.affiliation}</div>
              )}
              {author.country && (
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" />{author.country}</div>
              )}
              {author.email && (
                <a href={`mailto:${author.email}`} className="link-academic flex items-center gap-2">
                  <Mail className="w-4 h-4" />{author.email}
                </a>
              )}
              {author.orcid && (
                <a href={`https://orcid.org/${author.orcid}`} target="_blank" rel="noreferrer"
                  className="link-academic flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" /> ORCID: {author.orcid}
                </a>
              )}
            </div>
            {bio && <p className="mt-4 text-ink/85 leading-relaxed">{bio}</p>}
          </div>
        </header>

        <section className="mt-8">
          <h2 className="font-serif text-2xl font-bold text-ink mb-4 pb-2 border-b border-line">
            {t('author.publications')} ({articles.length})
          </h2>
          {articles.length === 0 ? (
            <p className="text-sub italic">{t('common.empty')}</p>
          ) : (
            <div className="space-y-3">
              {articles.map((a) => <ArticleCard key={a._id} article={a} />)}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
