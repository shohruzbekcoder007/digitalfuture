export const categoryColors = {
  research: 'bg-primary-50 text-primary-700 border-primary-100',
  review: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'case-study': 'bg-amber-50 text-amber-700 border-amber-100',
  editorial: 'bg-violet-50 text-violet-700 border-violet-100',
  'short-communication': 'bg-cyan-50 text-cyan-700 border-cyan-100',
  other: 'bg-gray-50 text-gray-700 border-gray-100',
};

export const languageLabels = {
  uz: "O'zbek",
  ru: 'Русский',
  en: 'English',
};

export const buildApaCitation = (article) => {
  if (!article) return '';
  const year = article.publicationDate ? new Date(article.publicationDate).getFullYear() : '';
  const names = (article.authorNames || article.authors?.map((a) => a.fullName) || []).join(', ');
  const title = article.title?.en || article.title?.uz || article.title?.ru || '';
  const issue = article.issue;
  const venue = issue ? `${issue.title?.en || ''}, Vol. ${issue.volume}, Issue ${issue.issueNumber}.` : '';
  const pages = article.pages ? ` pp. ${article.pages}.` : '';
  const doi = article.doi ? ` https://doi.org/${article.doi}` : '';
  return `${names} (${year}). ${title}. ${venue}${pages}${doi}`.trim();
};
