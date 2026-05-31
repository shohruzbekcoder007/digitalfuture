const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/issuesController');
const { protect, admin } = require('../middleware/auth');

router.get('/', ctrl.listIssues);
router.get('/current', ctrl.getCurrentIssue);
router.get('/archive', ctrl.getArchiveByYear);
router.get('/:slug', ctrl.getIssueBySlug);

router.patch('/:id/view', ctrl.incrementView);
router.patch('/:id/download', ctrl.incrementDownload);

router.post('/', protect, admin, ctrl.createIssue);
router.put('/:id', protect, admin, ctrl.updateIssue);
router.delete('/:id', protect, admin, ctrl.deleteIssue);

module.exports = router;
