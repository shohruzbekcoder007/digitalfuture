const mongoose = require('mongoose');
const slugify = require('slugify');

const Localized = {
  uz: { type: String, default: '' },
  ru: { type: String, default: '' },
  en: { type: String, default: '' },
};

const ArticleSchema = new mongoose.Schema(
  {
    title: Localized,
    abstract: Localized,
    body: Localized,
    authors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Author' }],
    authorNames: { type: [String], default: [], index: true },
    issue: { type: mongoose.Schema.Types.ObjectId, ref: 'JournalIssue', required: true, index: true },
    category: {
      type: String,
      enum: ['research', 'review', 'case-study', 'editorial', 'short-communication', 'other'],
      default: 'research',
      index: true,
    },
    keywords: { type: [String], default: [], index: true },
    doi: { type: String, default: '', index: true },
    pdfUrl: { type: String, default: '' },
    pages: { type: String, default: '' },
    language: { type: String, enum: ['uz', 'ru', 'en'], default: 'uz' },
    publicationDate: { type: Date, required: true },
    references: { type: [String], default: [] },
    slug: { type: String, unique: true, index: true },
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    featured: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

ArticleSchema.index({
  'title.uz': 'text',
  'title.ru': 'text',
  'title.en': 'text',
  'abstract.uz': 'text',
  'abstract.ru': 'text',
  'abstract.en': 'text',
  keywords: 'text',
  authorNames: 'text',
}, { language_override: 'searchLang' });

ArticleSchema.virtual('citation').get(function () {
  const year = this.publicationDate ? new Date(this.publicationDate).getFullYear() : '';
  const names = (this.authorNames || []).join(', ');
  const title = this.title?.en || this.title?.uz || this.title?.ru || '';
  return `${names} (${year}). ${title}. ${this.pages ? `pp. ${this.pages}.` : ''} ${this.doi ? `DOI: ${this.doi}` : ''}`.trim();
});

ArticleSchema.set('toJSON', { virtuals: true });
ArticleSchema.set('toObject', { virtuals: true });

ArticleSchema.pre('validate', async function (next) {
  if (this.slug) return next();
  const base = this.title?.en || this.title?.uz || this.title?.ru || 'article';
  let slug = slugify(base, { lower: true, strict: true });
  if (!slug) slug = `article-${Date.now()}`;
  let unique = slug;
  let i = 1;
  while (await mongoose.models.Article.findOne({ slug: unique })) {
    unique = `${slug}-${i++}`;
  }
  this.slug = unique;
  next();
});

module.exports = mongoose.model('Article', ArticleSchema);
