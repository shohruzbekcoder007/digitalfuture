const JournalIssue = require('../models/JournalIssue');
const Article = require('../models/Article');

exports.listIssues = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 12, 50);
    const skip = (page - 1) * limit;

    const filter = { isPublished: true };
    if (req.query.year) filter.year = parseInt(req.query.year, 10);
    if (req.query.volume) filter.volume = parseInt(req.query.volume, 10);
    if (req.query.search) {
      const term = req.query.search.trim();
      filter.$or = [
        { 'title.uz': { $regex: term, $options: 'i' } },
        { 'title.ru': { $regex: term, $options: 'i' } },
        { 'title.en': { $regex: term, $options: 'i' } },
      ];
    }

    const sort = { year: -1, volume: -1, issueNumber: -1 };

    const [items, total] = await Promise.all([
      JournalIssue.find(filter).sort(sort).skip(skip).limit(limit),
      JournalIssue.countDocuments(filter),
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

exports.getCurrentIssue = async (req, res, next) => {
  try {
    const current = await JournalIssue.findOne({ isCurrent: true, isPublished: true });
    let issue = current;
    if (!issue) {
      issue = await JournalIssue.findOne({ isPublished: true }).sort({
        year: -1,
        volume: -1,
        issueNumber: -1,
      });
    }
    if (!issue) return res.json({ success: true, data: null });

    const articles = await Article.find({ issue: issue._id })
      .populate('authors', 'fullName slug affiliation')
      .sort({ pages: 1, createdAt: 1 });

    res.json({ success: true, data: { issue, articles } });
  } catch (err) {
    next(err);
  }
};

exports.getArchiveByYear = async (req, res, next) => {
  try {
    const issues = await JournalIssue.find({ isPublished: true }).sort({
      year: -1,
      volume: -1,
      issueNumber: -1,
    });
    const grouped = issues.reduce((acc, issue) => {
      const y = issue.year;
      if (!acc[y]) acc[y] = [];
      acc[y].push(issue);
      return acc;
    }, {});
    res.json({ success: true, data: grouped });
  } catch (err) {
    next(err);
  }
};

exports.getIssueBySlug = async (req, res, next) => {
  try {
    const issue = await JournalIssue.findOne({ slug: req.params.slug });
    if (!issue) return res.status(404).json({ success: false, message: 'Son topilmadi' });

    const articles = await Article.find({ issue: issue._id })
      .populate('authors', 'fullName slug affiliation orcid')
      .sort({ pages: 1, createdAt: 1 });

    res.json({ success: true, data: { issue, articles } });
  } catch (err) {
    next(err);
  }
};

exports.createIssue = async (req, res, next) => {
  try {
    const issue = await JournalIssue.create(req.body);
    res.status(201).json({ success: true, data: issue });
  } catch (err) {
    next(err);
  }
};

exports.updateIssue = async (req, res, next) => {
  try {
    const issue = await JournalIssue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!issue) return res.status(404).json({ success: false, message: 'Son topilmadi' });
    res.json({ success: true, data: issue });
  } catch (err) {
    next(err);
  }
};

exports.deleteIssue = async (req, res, next) => {
  try {
    const issue = await JournalIssue.findByIdAndDelete(req.params.id);
    if (!issue) return res.status(404).json({ success: false, message: 'Son topilmadi' });
    await Article.deleteMany({ issue: issue._id });
    res.json({ success: true, message: "Son va unga tegishli maqolalar o'chirildi" });
  } catch (err) {
    next(err);
  }
};

exports.incrementView = async (req, res, next) => {
  try {
    await JournalIssue.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

exports.incrementDownload = async (req, res, next) => {
  try {
    await JournalIssue.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};
