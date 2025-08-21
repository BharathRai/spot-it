const express = require('express');
const querystring = require('querystring');
const axios = require('axios');
const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL;
const REDIRECT_URI = process.env.REDIRECT_URI; // This is now YOUR app's redirect URI

const SCOPES = [
  'playlist-modify-private',
  'playlist-modify-public',
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-read-collaborative'
].join(' ');

// NEW: Endpoint to receive and store user's Spotify credentials in their session
router.post('/configure', (req, res) => {
  const { clientId, clientSecret } = req.body;
  if (!clientId || !clientSecret) {
    return res.status(400).json({ error: 'Client ID and Client Secret are required.' });
  }
  // Store the credentials in the user's session
  req.session.clientId = clientId;
  req.session.clientSecret = clientSecret;
  res.json({ message: 'Credentials configured successfully.' });
});

// MODIFIED: /login now reads credentials from the session
router.get('/login', (req, res) => {
  const { clientId } = req.session;
  if (!clientId) {
    return res.status(400).redirect(`${FRONTEND_URL}?error=not_configured`);
  }

  const authUrl = 'https://accounts.spotify.com/authorize?' + querystring.stringify({
    response_type: 'code',
    client_id: clientId, // Use client ID from session
    scope: SCOPES,
    redirect_uri: REDIRECT_URI, // YOUR app's redirect URI
    show_dialog: true
  });
  res.redirect(authUrl);
});

// MODIFIED: /callback now reads credentials from the session
router.get('/callback', async (req, res) => {
  const code = req.query.code || null;
  const { clientId, clientSecret } = req.session;

  if (!code) {
    return res.redirect(`${FRONTEND_URL}/?error=auth_failed`);
  }
  if (!clientId || !clientSecret) {
    return res.redirect(`${FRONTEND_URL}/?error=not_configured`);
  }

  try {
    const tokenResponse = await axios.post('https://accounts.spotify.com/api/token',
      querystring.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
        }
      });

    const { access_token, refresh_token, expires_in } = tokenResponse.data;
    req.session.accessToken = access_token;
    req.session.refreshToken = refresh_token;
    req.session.expiresAt = Date.now() + expires_in * 1000;
    
    res.redirect(FRONTEND_URL);
  } catch (err) {
    console.error('Token exchange failed:', err.response ? err.response.data : err.message);
    res.redirect(`${FRONTEND_URL}/?error=auth_failed`);
  }
});

// Check if user's session is still valid (no change here)
router.get('/me', (req, res) => {
  if (req.session && req.session.accessToken) {
    res.json({ loggedIn: true });
  } else {
    res.json({ loggedIn: false });
  }
});

// Destroy the session on logout (no change here)
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out.' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});

module.exports = router;