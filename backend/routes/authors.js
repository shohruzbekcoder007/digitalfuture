const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authorsController');
const { protect, admin } = require('../middleware/auth');

router.get('/', ctrl.listAuthors);
router.get('/:slug', ctrl.getAuthorBySlug);

router.post('/', protect, admin, ctrl.createAuthor);
router.put('/:id', protect, admin, ctrl.updateAuthor);
router.delete('/:id', protect, admin, ctrl.deleteAuthor);

module.exports = router;
