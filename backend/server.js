require('dotenv').config();
const os = require('os');
const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (process.env.NODE_ENV === 'production') {
    const allowed = (process.env.CLIENT_URL || '').split(',').map((s) => s.trim()).filter(Boolean);
    return allowed.length === 0 || allowed.includes(origin);
  }
  try {
    const { hostname } = new URL(origin);
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true;
    if (/^10\./.test(hostname)) return true;
    if (/^192\.168\./.test(hostname)) return true;
    if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)) return true;
    if (/^169\.254\./.test(hostname)) return true;
    if (hostname === '::1') return true;
  } catch {}
  return true;
};

app.use(cors({
  origin: (origin, cb) => cb(null, isAllowedOrigin(origin)),
  credentials: true,
}));

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '7d',
  setHeaders: (res) => res.setHeader('Access-Control-Allow-Origin', '*'),
}));

app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

app.use('/api/issues', require('./routes/issues'));
app.use('/api/articles', require('./routes/articles'));
app.use('/api/authors', require('./routes/authors'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/uploads', require('./routes/uploads'));

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const getLanIps = () => {
  const ifaces = os.networkInterfaces();
  const out = [];
  for (const list of Object.values(ifaces)) {
    for (const it of list || []) {
      if (it.family === 'IPv4' && !it.internal) out.push(it.address);
    }
  }
  return out;
};

connectDB().then(() => {
  app.listen(PORT, HOST, () => {
    console.log(`Journal API ${PORT}-portda ishlamoqda (${process.env.NODE_ENV || 'development'})`);
    console.log(`  Local:    http://localhost:${PORT}/api/health`);
    for (const ip of getLanIps()) {
      console.log(`  Network:  http://${ip}:${PORT}/api/health`);
    }
    console.log(`  Uploads:  /uploads/`);
  });
});
