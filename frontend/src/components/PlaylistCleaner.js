import React, { useState, useEffect } from 'react';
import { getPlaylists, findDuplicatesInPlaylist, removeDuplicateTracks } from '../api/backendAPI';
import Loader from './Loader';

const PlaylistCleaner = () => {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  const [duplicates, setDuplicates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await getPlaylists();
        setPlaylists(response.data);
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to load your playlists.' });
      }
    };
    fetchPlaylists();
  }, []);

  const handleFindDuplicates = async () => {
    if (!selectedPlaylist) return;
    setIsLoading(true);
    setMessage(null);
    setDuplicates([]);
    try {
      const response = await findDuplicatesInPlaylist(selectedPlaylist);
      setDuplicates(response.data.duplicates);
      if (response.data.duplicates.length === 0) {
        setMessage({ type: 'success', text: 'No duplicates found in this playlist!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to scan for duplicates.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveDuplicates = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const tracksToRemove = duplicates.flatMap(d => d.positionsToRemove);
      await removeDuplicateTracks(selectedPlaylist, tracksToRemove);
      setMessage({ type: 'success', text: `${tracksToRemove.length} duplicate tracks removed!` });
      setDuplicates([]); // Clear the list after removal
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to remove duplicates.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tool-card" style={{ position: 'relative' }}>
      {isLoading && <Loader />}
      <h2>Playlist Cleaner</h2>
      <p>Find and remove duplicate songs from your playlists.</p>
      <div className="form-group">
        <label htmlFor="playlist-select">Select a Playlist:</label>
        <select
          id="playlist-select"
          value={selectedPlaylist}
          onChange={(e) => setSelectedPlaylist(e.target.value)}
          disabled={isLoading}
        >
          <option value="">-- Choose a playlist --</option>
          {playlists.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      <button onClick={handleFindDuplicates} className="btn btn-primary" disabled={!selectedPlaylist || isLoading}>
        Find Duplicates
      </button>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      {duplicates.length > 0 && (
        <>
          <h4>Found {duplicates.length} duplicate songs:</h4>
          <ul className="results-list">
            {duplicates.map(d => (
              <li key={d.uri}>{d.name} - {d.artist}</li>
            ))}
          </ul>
          <button onClick={handleRemoveDuplicates} className="btn btn-danger" disabled={isLoading}>
            Remove All Duplicates
          </button>
        </>
      )}
    </div>
  );
};

export default PlaylistCleaner;