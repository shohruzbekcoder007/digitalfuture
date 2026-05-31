import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { ArrowRight, BookOpen, Download } from 'lucide-react';
import Hero from '../components/Hero';
import ArticleCard from '../components/ArticleCard';
import JournalIssueCard from '../components/JournalIssueCard';
import SkeletonCard from '../components/SkeletonCard';
import { useCurrentIssue, useFeaturedArticles, useArticles, useIssues } from '../hooks/useJournal';
import { formatDate, pickLocalized } from '../utils/format';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.split('-')[0];

  const { data: currentRes, isLoading: loadingCurrent } = useCurrentIssue();
  const { data: featuredRes } = useFeaturedArticles();
  const { data: recentRes, isLoading: loadingRecent } = useArticles({ limit: 6, sort: 'newest' });
  const { data: issuesRes } = useIssues({ limit: 4 });

  const current = currentRes?.data?.issue;
  const currentArticles = currentRes?.data?.articles || [];
  const featured = featuredRes?.data || [];
  const recent = recentRes?.data || [];
  const recentIssues = issuesRes?.data || [];

  return (
    <>
      <Helmet>
        <title>{t('site.name')} — {t('site.tagline')}</title>
        <meta name="description" content={t('hero.subtitle')} />
        <meta property="og:title" content={t('site.name')} />
        <meta property="og:description" content={t('hero.subtitle')} />
      </Helmet>

      <Hero />

      {/* Current Issue spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">
              {t('home.currentIssue')}
            </div>
            <h2 className="font-serif text-3xl font-bold text-ink mt-1">
              {current ? pickLocalized(current.title, lang) : t('common.loading')}
            </h2>
          </div>
          {current && (
            <Link to={`/issues/${current.slug}`} className="link-academic text-sm font-medium hidden sm:inline-flex items-center gap-1">
              {t('issue.viewIssue')} <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {loadingCurrent ? (
          <div className="grid md:grid-cols-3 gap-6">
            <SkeletonCard variant="issue" />
            <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          </div>
        ) : current ? (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <JournalIssueCard issue={current} />
              <div className="mt-3 flex gap-2">
                {current.pdfUrl && (
                  <a
                    href={current.pdfUrl} target="_blank" rel="noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-white px-4 py-2.5 rounded-card text-sm font-medium hover:bg-primary-600"
                  >
                    <Download className="w-4 h-4" /> {t('issue.downloadPdf')}
                  </a>
                )}
                <Link
                  to={`/issues/${current.slug}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 border border-line text-ink px-4 py-2.5 rounded-card text-sm font-medium hover:border-primary hover:text-primary"
                >
                  <BookOpen className="w-4 h-4" /> {t('issue.viewIssue')}
                </Link>
              </div>
            </div>
            <div className="md:col-span-2 space-y-3">
              <div className="text-xs text-sub">
                {t('issue.articlesInIssue')} ({currentArticles.length})
              </div>
              {currentArticles.slice(0, 5).map((a) => (
                <ArticleCard key={a._id} article={a} variant="compact" />
              ))}
              {currentArticles.length === 0 && (
                <div className="text-sm text-sub italic">{t('issue.noArticles')}</div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-sub italic">{t('common.empty')}</div>
        )}
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="bg-surface border-y border-line">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-end justify-between mb-6">
              <h2 className="font-serif text-2xl font-bold text-ink">{t('home.featuredArticles')}</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.slice(0, 6).map((a) => (
                <ArticleCard key={a._id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent articles + recent issues */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-end justify-between mb-5">
            <h2 className="font-serif text-2xl font-bold text-ink">{t('home.recentArticles')}</h2>
            <Link to="/articles" className="link-academic text-sm font-medium inline-flex items-center gap-1">
              {t('home.browseAll')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {(loadingRecent ? Array.from({ length: 4 }) : recent).map((a, i) =>
              a ? <ArticleCard key={a._id} article={a} /> : <SkeletonCard key={i} />
            )}
          </div>
        </div>
        <aside>
          <h3 className="font-serif text-xl font-bold text-ink mb-4">{t('nav.archive')}</h3>
          <div className="space-y-3">
            {recentIssues.map((iss) => (
              <Link key={iss._id} to={`/issues/${iss.slug}`}
                className="block bg-white border border-line rounded-card p-4 hover:shadow-card transition"
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                  {t('issue.volume')} {iss.volume} · {t('issue.issue')} {iss.issueNumber}
                </div>
                <div className="font-serif font-semibold text-ink mt-1 line-clamp-1">
                  {pickLocalized(iss.title, lang)}
                </div>
                <div className="text-xs text-sub mt-1">{formatDate(iss.publicationDate, lang)}</div>
              </Link>
            ))}
          </div>
          <Link to="/archive" className="mt-4 link-academic text-sm font-medium inline-flex items-center gap-1">
            {t('archive.title')} <ArrowRight className="w-4 h-4" />
          </Link>
        </aside>
      </section>
    </>
  );
}
