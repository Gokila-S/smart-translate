import express from 'express';
import jwt from 'jsonwebtoken';
import History from '../models/History.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

function auth(req, res, next) {
  const h = req.headers.authorization || '';
  const [, token] = h.split(' ');
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

router.get('/', auth, async (req, res) => {
  try {
    const items = await History.find({ user: req.userId }).sort({ createdAt: -1 }).lean();
  	res.json({ items });
  } catch (e) {
    res.status(500).json({ error: 'Failed to load history' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { original, translated, lang } = req.body || {};
    if (!original || !translated || !lang) return res.status(400).json({ error: 'Missing fields' });
    const item = await History.create({ user: req.userId, original, translated, lang });
    res.json({ item });
  } catch (e) {
    res.status(500).json({ error: 'Failed to save history' });
  }
});

export default router;
