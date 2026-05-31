const Article = require('../models/Article');
const Author = require('../models/Author');

exports.listArticles = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 12, 50);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.category && req.query.category !== 'all') filter.category = req.query.category;
    if (req.query.language && req.query.language !== 'all') filter.language = req.query.language;
    if (req.query.issue) filter.issue = req.query.issue;
    if (req.query.author) filter.authors = req.query.author;
    if (req.query.year) {
      const y = parseInt(req.query.year, 10);
      filter.publicationDate = {
        $gte: new Date(`${y}-01-01`),
        $lt: new Date(`${y + 1}-01-01`),
      };
    }
    if (req.query.featured === 'true') filter.featured = true;

    if (req.query.search) {
      const term = req.query.search.trim();
      const rx = { $regex: term, $options: 'i' };
      filter.$or = [
        { 'title.uz': rx }, { 'title.ru': rx }, { 'title.en': rx },
        { 'abstract.uz': rx }, { 'abstract.ru': rx }, { 'abstract.en': rx },
        { keywords: rx },
        { authorNames: rx },
        { doi: rx },
      ];
    }

    const sort =
      req.query.sort === 'oldest' ? { publicationDate: 1 } :
      req.query.sort === 'popular' ? { views: -1 } :
      req.query.sort === 'downloads' ? { downloads: -1 } :
      { publicationDate: -1 };

    const [items, total] = await Promise.all([
      Article.find(filter)
        .populate('authors', 'fullName slug affiliation')
        .populate('issue', 'volume issueNumber year title slug coverImage')
        .sort(sort).skip(skip).limit(limit),
      Article.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: items,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
};

exports.getFeatured = async (req, res, next) => {
  try {
    const items = await Article.find({ featured: true })
      .populate('authors', 'fullName slug')
      .populate('issue', 'volume issueNumber year slug')
      .sort({ publicationDate: -1 })
      .limit(6);
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

exports.getArticleBySlug = async (req, res, next) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug })
      .populate('authors')
      .populate('issue', 'volume issueNumber year slug coverImage publicationDate title');
    if (!article) return res.status(404).json({ success: false, message: 'Maqola topilmadi' });
    res.json({ success: true, data: article });
  } catch (err) {
    next(err);
  }
};

exports.getRelated = async (req, res, next) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (!article) return res.json({ success: true, data: [] });
    const items = await Article.find({
      _id: { $ne: article._id },
      $or: [
        { category: article.category },
        { keywords: { $in: article.keywords } },
        { authors: { $in: article.authors } },
      ],
    })
      .populate('authors', 'fullName slug')
      .populate('issue', 'volume issueNumber year slug')
      .sort({ publicationDate: -1 })
      .limit(3);
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

exports.createArticle = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (payload.authors?.length) {
      const authors = await Author.find({ _id: { $in: payload.authors } });
      payload.authorNames = authors.map((a) => a.fullName);
    }
    const article = await Article.create(payload);
    res.status(201).json({ success: true, data: article });
  } catch (err) {
    next(err);
  }
};

exports.updateArticle = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (payload.authors?.length) {
      const authors = await Author.find({ _id: { $in: payload.authors } });
      payload.authorNames = authors.map((a) => a.fullName);
    }
    const article = await Article.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });
    if (!article) return res.status(404).json({ success: false, message: 'Maqola topilmadi' });
    res.json({ success: true, data: article });
  } catch (err) {
    next(err);
  }
};

exports.deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) return res.status(404).json({ success: false, message: 'Maqola topilmadi' });
    res.json({ success: true, message: "O'chirildi" });
  } catch (err) {
    next(err);
  }
};

exports.incrementView = async (req, res, next) => {
  try {
    await Article.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

exports.incrementDownload = async (req, res, next) => {
  try {
    await Article.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
