const mongoose = require('mongoose');
const slugify = require('slugify');

const AuthorSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    affiliation: { type: String, default: '' },
    country: { type: String, default: '' },
    email: { type: String, default: '', lowercase: true, trim: true },
    orcid: { type: String, default: '' },
    bio: {
      uz: { type: String, default: '' },
      ru: { type: String, default: '' },
      en: { type: String, default: '' },
    },
    avatar: { type: String, default: '' },
    slug: { type: String, unique: true, index: true },
  },
  { timestamps: true }
);

AuthorSchema.index({ fullName: 'text', affiliation: 'text' });

AuthorSchema.pre('validate', async function (next) {
  if (this.slug) return next();
  let base = slugify(this.fullName || 'author', { lower: true, strict: true });
  if (!base) base = `author-${Date.now()}`;
  let unique = base;
  let i = 1;
  while (await mongoose.models.Author.findOne({ slug: unique })) {
    unique = `${base}-${i++}`;
  }
  this.slug = unique;
  next();
});

module.exports = mongoose.model('Author', AuthorSchema);
