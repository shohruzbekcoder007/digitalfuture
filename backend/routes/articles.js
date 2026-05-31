const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/articlesController');
const { protect, admin } = require('../middleware/auth');

router.get('/', ctrl.listArticles);
router.get('/featured', ctrl.getFeatured);
router.get('/:slug', ctrl.getArticleBySlug);
router.get('/:slug/related', ctrl.getRelated);

router.patch('/:id/view', ctrl.incrementView);
router.patch('/:id/download', ctrl.incrementDownload);

router.post('/', protect, admin, ctrl.createArticle);
router.put('/:id', protect, admin, ctrl.updateArticle);
router.delete('/:id', protect, admin, ctrl.deleteArticle);

module.exports = router;
