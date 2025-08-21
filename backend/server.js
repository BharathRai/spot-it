require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const authRouter = require('./routes/auth');
const playlistRouter = require('./routes/playlist');
const playlistToolsRouter = require('./routes/playlistTools');

const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

// In production, trust the first proxy (e.g., Nginx, Heroku)
if (isProduction) {
  app.set('trust proxy', 1);
}

app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true, // Prevent client-side JS from accessing the cookie
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-site cookies, 'lax' for same-site
    secure: isProduction, // Only send cookie over HTTPS in production
  }
}));

// API Routes
app.use('/auth', authRouter);
app.use('/playlist', playlistRouter);
app.use('/tools', playlistToolsRouter);

app.get('/', (req, res) => res.send('Spot-IT backend is running.'));

app.listen(PORT, () => {
  console.log(`✅ Backend listening on http://localhost:${PORT}`);
});