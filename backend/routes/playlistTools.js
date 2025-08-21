const express = require('express');
const axios = require('axios');
const { isAuthenticated } = require('../middleware/authMiddleware');
const router = express.Router();

const SPOTIFY_API_URL = 'https://api.spotify.com/v1';

// All routes in this file require authentication
router.use(isAuthenticated);

// Helper to fetch all tracks from a playlist, handling pagination
const getAllPlaylistTracks = async (playlistId, accessToken) => {
    let tracks = [];
    let nextUrl = `${SPOTIFY_API_URL}/playlists/${playlistId}/tracks?limit=50`;
    while (nextUrl) {
        const response = await axios.get(nextUrl, { headers: { Authorization: `Bearer ${accessToken}` } });
        tracks = tracks.concat(response.data.items);
        nextUrl = response.data.next;
    }
    return tracks;
};

// Get all playlists owned by the current user
router.get('/my-playlists', async (req, res) => {
    try {
        const meResponse = await axios.get(`${SPOTIFY_API_URL}/me`, { headers: { Authorization: `Bearer ${req.session.accessToken}` }});
        const userId = meResponse.data.id;

        let playlists = [];
        let nextUrl = `${SPOTIFY_API_URL}/me/playlists?limit=50`;
        while(nextUrl) {
            const response = await axios.get(nextUrl, { headers: { Authorization: `Bearer ${req.session.accessToken}` } });
            // Filter to only include playlists they own (not subscribed to)
            const ownedPlaylists = response.data.items.filter(p => p.owner.id === userId);
            playlists = playlists.concat(ownedPlaylists);
            nextUrl = response.data.next;
        }
        res.json(playlists);
    } catch (err) {
        console.error("Failed to get user playlists:", err.response?.data);
        res.status(500).json({ error: 'Failed to get user playlists' });
    }
});

// Find duplicate tracks in a specific playlist
router.post('/find-duplicates', async (req, res) => {
    const { playlist_id: playlistId } = req.body;
    if (!playlistId) return res.status(400).json({ error: 'Playlist ID is required.' });
    
    try {
        const allTracks = await getAllPlaylistTracks(playlistId, req.session.accessToken);
        const trackUriMap = new Map();
        
        allTracks.forEach((item, index) => {
            if (!item?.track?.uri) return;
            const uri = item.track.uri;
            if (!trackUriMap.has(uri)) {
                trackUriMap.set(uri, { positions: [] });
            }
            trackUriMap.get(uri).positions.push({ index });
        });

        const duplicates = [];
        for (const [uri, data] of trackUriMap.entries()) {
            if (data.positions.length > 1) {
                const trackInfo = allTracks[data.positions[0].index].track;
                duplicates.push({
                    uri,
                    name: trackInfo.name,
                    artist: trackInfo.artists.map(a => a.name).join(', '),
                    // Keep the first occurrence, mark subsequent ones for removal
                    positionsToRemove: data.positions.slice(1).map(p => ({ uri, positions: [p.index] })),
                });
            }
        }
        res.json({ duplicates });
    } catch(err) {
        console.error("Failed to find duplicates:", err.response?.data);
        res.status(500).json({ error: 'Failed to find duplicates' });
    }
});

// Remove a list of tracks (duplicates) from a playlist
router.post('/remove-duplicates', async (req, res) => {
    const { playlist_id: playlistId, tracks } = req.body;
    if (!playlistId || !tracks) return res.status(400).json({ error: "Playlist ID and tracks are required."});

    try {
        // Spotify API allows deleting 100 tracks at a time
        for (let i = 0; i < tracks.length; i += 100) {
            const chunk = tracks.slice(i, i + 100);
            await axios.delete(`${SPOTIFY_API_URL}/playlists/${playlistId}/tracks`, {
                headers: { Authorization: `Bearer ${req.session.accessToken}` },
                data: { tracks: chunk }
            });
        }
        res.json({ success: true, message: 'Duplicates removed successfully.' });
    } catch (err) {
        console.error("Failed to remove duplicates:", err.response?.data);
        res.status(500).json({ error: 'Failed to remove duplicates' });
    }
});

// Archive "Discover Weekly" or "Release Radar"
router.post('/archive-weekly', async (req, res) => {
    const { type } = req.body; // e.g., "Discover Weekly"
    if (!type) return res.status(400).json({ error: "Playlist type is required."});

    try {
        const meResponse = await axios.get(`${SPOTIFY_API_URL}/me`, { headers: { Authorization: `Bearer ${req.session.accessToken}` }});
        const userId = meResponse.data.id;

        // Search for the official Spotify playlist
        const searchResponse = await axios.get(`${SPOTIFY_API_URL}/search`, {
            headers: { Authorization: `Bearer ${req.session.accessToken}` },
            params: { q: type, type: 'playlist', limit: 10 }
        });
        const sourcePlaylist = searchResponse.data.playlists.items.find(p => p.owner.id === 'spotify' && p.name === type);
        
        if (!sourcePlaylist) return res.status(404).json({ error: `${type} playlist not found in your library.` });
        
        const tracks = await getAllPlaylistTracks(sourcePlaylist.id, req.session.accessToken);
        const trackUris = tracks.map(item => item.track.uri).filter(Boolean);

        const date = new Date().toISOString().slice(0, 10);
        const newPlaylistName = `${type} Archive - ${date}`;

        // Create the new archive playlist
        const createResponse = await axios.post(`${SPOTIFY_API_URL}/users/${userId}/playlists`, 
            { name: newPlaylistName, public: false, description: `Archived from ${type} on ${date} by Spot-IT.` },
            { headers: { Authorization: `Bearer ${req.session.accessToken}` } }
        );
        const newPlaylist = createResponse.data;

        // Add tracks to the new playlist
        if (trackUris.length > 0) {
           for (let i = 0; i < trackUris.length; i += 100) {
                const chunk = trackUris.slice(i, i + 100);
                await axios.post(`${SPOTIFY_API_URL}/playlists/${newPlaylist.id}/tracks`, { uris: chunk }, { headers: { Authorization: `Bearer ${req.session.accessToken}` } });
            }
        }

        res.json({ success: true, playlist_url: newPlaylist.external_urls.spotify, name: newPlaylist.name });
    } catch (err) {
        console.error(`Failed to archive ${type}:`, err.response?.data);
        res.status(500).json({ error: `Failed to archive ${type}` });
    }
});

module.exports = router;