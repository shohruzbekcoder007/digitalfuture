import { Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PdfDownloadButton({ url, onClick, variant = 'primary', label }) {
  const { t } = useTranslation();
  if (!url) return null;
  const klass =
    variant === 'primary'
      ? 'bg-primary text-white hover:bg-primary-600'
      : 'bg-white border border-line text-ink hover:border-primary hover:text-primary';
  return (
    <a
      href={url} target="_blank" rel="noreferrer" onClick={onClick}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-card text-sm font-medium transition ${klass}`}
    >
      <Download className="w-4 h-4" />
      {label || t('article.downloadPdf')}
    </a>
  );
}
