import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true,
});

// NEW function to configure the session with user's keys
export const configureCredentials = (clientId, clientSecret) => API.post('/auth/configure', { clientId, clientSecret });

export const checkLoginStatus = () => API.get('/auth/me');
export const logout = () => API.post('/auth/logout');

export const getPlaylists = () => API.get('/tools/my-playlists');
export const findDuplicatesInPlaylist = (playlist_id) => API.post('/tools/find-duplicates', { playlist_id });
export const removeDuplicateTracks = (playlist_id, tracks) => API.post('/tools/remove-duplicates', { playlist_id, tracks });

export const archiveWeeklyPlaylist = (type) => API.post('/tools/archive-weekly', { type });

export const createPlaylistFromFiles = (playlist_name, tracks) => API.post('/playlist/create', { playlist_name, tracks });