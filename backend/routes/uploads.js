const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const { upload, fileUrl } = require('../config/upload');

router.post('/image', protect, admin, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'Fayl yuborilmadi' });
  res.json({ success: true, url: fileUrl(req, req.file) });
});

router.post('/pdf', protect, admin, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'PDF yuborilmadi' });
  res.json({ success: true, url: fileUrl(req, req.file) });
});

module.exports = router;
