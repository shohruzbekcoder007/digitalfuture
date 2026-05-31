const path = require('path');
const fs = require('fs');
const multer = require('multer');

const useCloudinary =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

let storage;
let cloudinary = null;

if (useCloudinary) {
  cloudinary = require('cloudinary').v2;
  const { CloudinaryStorage } = require('multer-storage-cloudinary');

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'journal_portal',
      resource_type: 'auto',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
    },
  });

  console.log('[upload] Cloudinary storage enabled');
} else {
  const uploadsDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
      const safe = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      cb(null, `${Date.now()}-${safe}`);
    },
  });

  console.log('[upload] Local disk storage enabled (uploads/)');
}

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
});

const fileUrl = (req, file) => {
  if (!file) return '';
  if (useCloudinary) return file.path;
  const base = `${req.protocol}://${req.get('host')}`;
  return `${base}/uploads/${file.filename}`;
};

module.exports = { upload, fileUrl, useCloudinary, cloudinary };
