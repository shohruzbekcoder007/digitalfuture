const Author = require('../models/Author');
const Article = require('../models/Article');

exports.listAuthors = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 24, 100);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.search) {
      const rx = { $regex: req.query.search.trim(), $options: 'i' };
      filter.$or = [{ fullName: rx }, { affiliation: rx }, { country: rx }];
    }

    const [items, total] = await Promise.all([
      Author.find(filter).sort({ fullName: 1 }).skip(skip).limit(limit),
      Author.countDocuments(filter),
    ]);

    const withCounts = await Promise.all(
      items.map(async (a) => {
        const articlesCount = await Article.countDocuments({ authors: a._id });
        return { ...a.toObject(), articlesCount };
      })
    );

    res.json({
      success: true,
      data: withCounts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAuthorBySlug = async (req, res, next) => {
  try {
    const author = await Author.findOne({ slug: req.params.slug });
    if (!author) return res.status(404).json({ success: false, message: 'Muallif topilmadi' });

    const articles = await Article.find({ authors: author._id })
      .populate('issue', 'volume issueNumber year slug')
      .populate('authors', 'fullName slug')
      .sort({ publicationDate: -1 });

    res.json({ success: true, data: { author, articles } });
  } catch (err) {
    next(err);
  }
};

exports.createAuthor = async (req, res, next) => {
  try {
    const author = await Author.create(req.body);
    res.status(201).json({ success: true, data: author });
  } catch (err) {
    next(err);
  }
};

exports.updateAuthor = async (req, res, next) => {
  try {
    const author = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!author) return res.status(404).json({ success: false, message: 'Muallif topilmadi' });
    res.json({ success: true, data: author });
  } catch (err) {
    next(err);
  }
};

exports.deleteAuthor = async (req, res, next) => {
  try {
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) return res.status(404).json({ success: false, message: 'Muallif topilmadi' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
