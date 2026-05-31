import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Download, Calendar, FileText, Eye, BookOpen } from 'lucide-react';
import { useIssue } from '../hooks/useJournal';
import { incrementIssueView, incrementIssueDownload } from '../services/issuesService';
import ArticleCard from '../components/ArticleCard';
import { formatDate, pickLocalized } from '../utils/format';

export default function IssueDetailPage() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language.split('-')[0];
  const { data, isLoading } = useIssue(slug);

  const issue = data?.data?.issue;
  const articles = data?.data?.articles || [];

  useEffect(() => {
    if (issue?._id) incrementIssueView(issue._id).catch(() => {});
  }, [issue?._id]);

  if (isLoading) {
    return <div className="max-w-7xl mx-auto px-4 py-12 text-sub">{t('common.loading')}</div>;
  }
  if (!issue) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <p className="text-sub italic">{t('common.empty')}</p>
        <Link to="/archive" className="link-academic mt-3 inline-block">← {t('archive.title')}</Link>
      </div>
    );
  }

  const title = pickLocalized(issue.title, lang);
  const description = pickLocalized(issue.description, lang);
  const fallback = `https://picsum.photos/seed/${issue.slug}/600/800`;

  return (
    <>
      <Helmet>
        <title>{title} — {t('site.name')}</title>
        <meta name="description" content={description.slice(0, 160)} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description.slice(0, 160)} />
        {issue.coverImage && <meta property="og:image" content={issue.coverImage} />}
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center gap-2 text-sm text-sub mb-6">
          <Link to="/" className="hover:text-primary">{t('nav.home')}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/archive" className="hover:text-primary">{t('nav.archive')}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-ink truncate">{title}</span>
        </nav>

        <div className="grid md:grid-cols-[260px_1fr] gap-8 mb-10">
          <div>
            <img
              src={issue.coverImage || fallback}
              alt={title}
              className="w-full rounded-card border border-line"
            />
            {issue.pdfUrl && (
              <a
                href={issue.pdfUrl} target="_blank" rel="noreferrer"
                onClick={() => issue._id && incrementIssueDownload(issue._id).catch(() => {})}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-card text-sm font-medium hover:bg-primary-600"
              >
                <Download className="w-4 h-4" /> {t('issue.downloadPdf')}
              </a>
            )}
          </div>

          <div>
            {issue.isCurrent && (
              <div className="inline-block bg-primary-50 text-primary text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-badge mb-3">
                {t('issue.current')}
              </div>
            )}
            <div className="text-sm font-semibold text-primary uppercase tracking-wider">
              {t('issue.volume')} {issue.volume} · {t('issue.issue')} {issue.issueNumber} · {issue.year}
            </div>
            <h1 className="mt-2 font-serif text-3xl md:text-4xl font-bold text-ink leading-tight">
              {title}
            </h1>
            {description && (
              <p className="mt-4 text-sub leading-relaxed max-w-prose">{description}</p>
            )}
            <dl className="mt-6 grid sm:grid-cols-2 gap-3 text-sm">
              <Stat icon={<Calendar className="w-4 h-4" />} label={t('issue.publicationDate')}
                value={formatDate(issue.publicationDate, lang)} />
              <Stat icon={<BookOpen className="w-4 h-4" />} label={t('issue.pages')}
                value={issue.pages || '—'} />
              <Stat icon={<FileText className="w-4 h-4" />} label="ISSN" value={issue.issn || '—'} />
              <Stat icon={<Eye className="w-4 h-4" />} label={t('article.views')} value={issue.views || 0} />
            </dl>
          </div>
        </div>

        <section>
          <h2 className="font-serif text-2xl font-bold text-ink mb-4 pb-2 border-b border-line">
            {t('issue.articlesInIssue')} ({articles.length})
          </h2>
          {articles.length === 0 ? (
            <p className="text-sub italic">{t('issue.noArticles')}</p>
          ) : (
            <div className="space-y-4">
              {articles.map((a) => <ArticleCard key={a._id} article={a} />)}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function Stat({ icon, label, value }) {
  return (
    <div className="bg-surface border border-line rounded-card p-3">
      <dt className="text-xs uppercase tracking-wide text-sub flex items-center gap-1.5">
        {icon} {label}
      </dt>
      <dd className="mt-1 font-semibold text-ink">{value}</dd>
    </div>
  );
}
