const express = require('express');
const axios = require('axios');
const { isAuthenticated } = require('../middleware/authMiddleware');
const router = express.Router();

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

// Helper to find a track's URI
async function searchTrack(accessToken, query) {
  try {
    const response = await axios.get(`${SPOTIFY_API_URL}/search`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { q: query, type: 'track', limit: 1 }
    });
    return response.data.tracks.items?.[0]?.uri || null;
  } catch (error) {
    console.error(`Failed to search for track: ${query}`, error.response?.data);
    return null;
  }
}

// Helper to create a new playlist
async function createPlaylist(accessToken, userId, name) {
  const response = await axios.post(`${SPOTIFY_API_URL}/users/${userId}/playlists`,
    { name, public: false, description: 'Created by Spot-IT' },
    { headers: { Authorization: `Bearer ${accessToken}` } });
  return response.data;
}

router.post('/create', isAuthenticated, async (req, res) => {
  const accessToken = req.session.accessToken;
  const { playlist_name: playlistName, tracks } = req.body;

  if (!playlistName || !Array.isArray(tracks)) {
    return res.status(400).json({ error: 'Missing playlist_name or tracks array' });
  }

  try {
    const meResponse = await axios.get(`${SPOTIFY_API_URL}/me`, { headers: { Authorization: `Bearer ${accessToken}` } });
    const userId = meResponse.data.id;

    const playlist = await createPlaylist(accessToken, userId, playlistName);
    const uris = (await Promise.all(tracks.map(t => searchTrack(accessToken, t)))).filter(Boolean);

    if (uris.length > 0) {
      // Spotify API allows adding 100 tracks at a time
      for (let i = 0; i < uris.length; i += 100) {
        const chunk = uris.slice(i, i + 100);
        await axios.post(`${SPOTIFY_API_URL}/playlists/${playlist.id}/tracks`, { uris: chunk }, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
      }
    }

    res.json({
      success: true,
      playlist_url: playlist.external_urls.spotify,
      added: uris.length,
      notFound: tracks.length - uris.length,
    });
  } catch (err) {
    console.error('Create playlist error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to create playlist.' });
  }
});

module.exports = router;