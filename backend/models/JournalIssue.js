const mongoose = require('mongoose');
const slugify = require('slugify');

const Localized = {
  uz: { type: String, default: '' },
  ru: { type: String, default: '' },
  en: { type: String, default: '' },
};

const JournalIssueSchema = new mongoose.Schema(
  {
    title: Localized,
    description: Localized,
    volume: { type: Number, required: true, index: true },
    issueNumber: { type: Number, required: true, index: true },
    year: { type: Number, required: true, index: true },
    publicationDate: { type: Date, required: true },
    coverImage: { type: String, default: '' },
    pdfUrl: { type: String, default: '' },
    issn: { type: String, default: '' },
    pages: { type: Number, default: 0 },
    isCurrent: { type: Boolean, default: false, index: true },
    isPublished: { type: Boolean, default: true, index: true },
    slug: { type: String, unique: true, index: true },
    views: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
  },
  { timestamps: true }
);

JournalIssueSchema.index({ 'title.uz': 'text', 'title.ru': 'text', 'title.en': 'text' });
JournalIssueSchema.index({ volume: 1, issueNumber: 1 }, { unique: true });

JournalIssueSchema.pre('validate', async function (next) {
  if (this.slug) return next();
  const base = `vol-${this.volume}-issue-${this.issueNumber}-${this.year}`;
  let unique = base;
  let i = 1;
  while (await mongoose.models.JournalIssue.findOne({ slug: unique })) {
    unique = `${base}-${i++}`;
  }
  this.slug = unique;
  next();
});

JournalIssueSchema.pre('save', async function (next) {
  if (this.isCurrent) {
    await mongoose.models.JournalIssue.updateMany(
      { _id: { $ne: this._id } },
      { $set: { isCurrent: false } }
    );
  }
  next();
});

module.exports = mongoose.model('JournalIssue', JournalIssueSchema);
