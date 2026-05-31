import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import DOMPurify from 'dompurify';
import {
  ChevronRight, Download, Eye, Share2, FileText, ExternalLink, Calendar, User
} from 'lucide-react';
import { useArticle, useRelatedArticles } from '../hooks/useJournal';
import { incrementArticleView, incrementArticleDownload } from '../services/articlesService';
import { formatDate, pickLocalized } from '../utils/format';
import { categoryColors } from '../utils/badges';
import CitationBox from '../components/CitationBox';
import ArticleCard from '../components/ArticleCard';
import toast from 'react-hot-toast';

export default function ArticleDetailPage() {
  const { slug } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language.split('-')[0];

  const { data, isLoading } = useArticle(slug);
  const { data: relatedRes } = useRelatedArticles(slug);
  const article = data?.data;
  const related = relatedRes?.data || [];

  useEffect(() => {
    if (article?._id) incrementArticleView(article._id).catch(() => {});
  }, [article?._id]);

  if (isLoading) {
    return <div className="max-w-4xl mx-auto px-4 py-12 text-sub">{t('common.loading')}</div>;
  }
  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <p className="text-sub italic">{t('common.empty')}</p>
        <Link to="/articles" className="link-academic mt-3 inline-block">← {t('nav.articles')}</Link>
      </div>
    );
  }

  const title = pickLocalized(article.title, lang);
  const abstract = pickLocalized(article.abstract, lang);
  const body = pickLocalized(article.body, lang);
  const safeHtml = DOMPurify.sanitize(body.replace(/\n/g, '<br/>'));
  const authors = article.authors || [];

  const onDownload = () => {
    if (article._id) incrementArticleDownload(article._id).catch(() => {});
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) { try { await navigator.share({ title, url }); } catch {} }
    else { navigator.clipboard.writeText(url); toast.success('Link nusxalandi'); }
  };

  return (
    <>
      <Helmet>
        <title>{title} — {t('site.name')}</title>
        <meta name="description" content={abstract.slice(0, 200)} />
        <meta name="keywords" content={(article.keywords || []).join(', ')} />
        <meta name="citation_title" content={title} />
        <meta name="citation_author" content={authors.map((a) => a.fullName).join('; ')} />
        <meta name="citation_publication_date" content={formatDate(article.publicationDate, 'en', 'yyyy/MM/dd')} />
        {article.doi && <meta name="citation_doi" content={article.doi} />}
        {article.pdfUrl && <meta name="citation_pdf_url" content={article.pdfUrl} />}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={abstract.slice(0, 200)} />
      </Helmet>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center gap-2 text-sm text-sub mb-4">
          <Link to="/" className="hover:text-primary">{t('nav.home')}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/articles" className="hover:text-primary">{t('nav.articles')}</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-ink truncate">{title}</span>
        </nav>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-badge text-xs font-semibold border ${categoryColors[article.category]}`}>
            {t(`category.${article.category}`)}
          </span>
          {article.issue && (
            <Link to={`/issues/${article.issue.slug}`} className="text-xs text-primary hover:underline font-medium">
              {t('issue.volume')} {article.issue.volume} · {t('issue.issue')} {article.issue.issueNumber} ({article.issue.year || new Date(article.publicationDate).getFullYear()})
            </Link>
          )}
        </div>

        <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink leading-tight">{title}</h1>

        {authors.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            {authors.map((a, i) => (
              <Link key={a._id || i} to={`/authors/${a.slug}`} className="link-academic font-medium">
                {a.fullName}{i < authors.length - 1 && ','}
              </Link>
            ))}
          </div>
        )}
        {authors.length > 0 && authors[0]?.affiliation && (
          <div className="mt-1 text-xs text-sub">
            {authors.map((a) => a.affiliation).filter(Boolean).slice(0, 3).join(' · ')}
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-sub border-y border-line py-3">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> {formatDate(article.publicationDate, lang)}
          </span>
          {article.pages && <span>pp. {article.pages}</span>}
          {article.doi && (
            <a href={`https://doi.org/${article.doi}`} target="_blank" rel="noreferrer"
              className="link-academic inline-flex items-center gap-1">
              DOI: {article.doi} <ExternalLink className="w-3 h-3" />
            </a>
          )}
          <span className="inline-flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{article.views || 0} {t('article.views')}</span>
          <span className="inline-flex items-center gap-1"><Download className="w-3.5 h-3.5" />{article.downloads || 0} {t('article.downloads')}</span>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {article.pdfUrl && (
            <a
              href={article.pdfUrl} target="_blank" rel="noreferrer" onClick={onDownload}
              className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-card text-sm font-medium hover:bg-primary-600"
            >
              <Download className="w-4 h-4" /> {t('article.downloadPdf')}
            </a>
          )}
          {article.pdfUrl && (
            <a
              href={article.pdfUrl} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 bg-white border border-line px-5 py-2.5 rounded-card text-sm font-medium hover:border-primary hover:text-primary"
            >
              <FileText className="w-4 h-4" /> {t('article.viewPdf')}
            </a>
          )}
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-2 bg-white border border-line px-5 py-2.5 rounded-card text-sm font-medium hover:border-primary hover:text-primary"
          >
            <Share2 className="w-4 h-4" /> {t('article.share')}
          </button>
        </div>

        <section className="mt-8">
          <h2 className="font-serif text-xl font-bold text-ink mb-2">{t('article.abstract')}</h2>
          <p className="text-ink/85 leading-relaxed font-serif">{abstract}</p>
        </section>

        {article.keywords?.length > 0 && (
          <section className="mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-sub mb-2">
              {t('article.keywords')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {article.keywords.map((k) => (
                <Link key={k} to={`/articles?search=${encodeURIComponent(k)}`}
                  className="text-xs px-2.5 py-1 rounded-badge bg-primary-50 text-primary hover:bg-primary-100">
                  {k}
                </Link>
              ))}
            </div>
          </section>
        )}

        {body && (
          <section className="mt-8">
            <h2 className="font-serif text-xl font-bold text-ink mb-3">{t('article.fullText')}</h2>
            <div className="prose-academic" dangerouslySetInnerHTML={{ __html: safeHtml }} />
          </section>
        )}

        {article.references?.length > 0 && (
          <section className="mt-8">
            <h2 className="font-serif text-xl font-bold text-ink mb-3">{t('article.references')}</h2>
            <ol className="space-y-2 text-sm text-ink/85 font-serif list-decimal pl-5">
              {article.references.map((r, i) => <li key={i}>{r}</li>)}
            </ol>
          </section>
        )}

        <section className="mt-8">
          <CitationBox article={article} />
        </section>

        {authors.length > 0 && (
          <section className="mt-10">
            <h2 className="font-serif text-xl font-bold text-ink mb-4">{t('article.authors')}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {authors.map((a) => (
                <Link key={a._id} to={`/authors/${a.slug}`}
                  className="bg-white border border-line rounded-card p-4 hover:shadow-card transition flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-50 text-primary font-semibold flex items-center justify-center shrink-0">
                    {(a.fullName || '?').split(' ').map(s => s[0]).slice(0, 2).join('')}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-ink truncate">{a.fullName}</div>
                    {a.affiliation && <div className="text-xs text-sub truncate flex items-center gap-1"><User className="w-3 h-3" />{a.affiliation}</div>}
                    {a.orcid && <div className="text-xs text-sub mt-0.5">ORCID: {a.orcid}</div>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="font-serif text-xl font-bold text-ink mb-4">{t('article.relatedArticles')}</h2>
            <div className="space-y-3">
              {related.map((r) => <ArticleCard key={r._id} article={r} variant="compact" />)}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
