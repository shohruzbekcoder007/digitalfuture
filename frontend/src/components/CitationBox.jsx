import { useState } from 'react';
import { Copy, Check, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { buildApaCitation } from '../utils/badges';
import toast from 'react-hot-toast';

export default function CitationBox({ article }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const citation = buildApaCitation(article);

  const copy = () => {
    navigator.clipboard.writeText(citation);
    setCopied(true);
    toast.success(t('article.citationCopied'));
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="bg-surface border border-line rounded-card p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="text-xs font-semibold uppercase tracking-wider text-sub flex items-center gap-1.5">
          <Quote className="w-3.5 h-3.5" /> {t('article.cite')} (APA)
        </div>
        <button
          onClick={copy}
          className="text-xs inline-flex items-center gap-1 text-primary hover:underline"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="text-sm text-ink leading-relaxed font-serif">{citation}</p>
    </div>
  );
}
