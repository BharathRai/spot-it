import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { createPlaylistFromFiles } from '../api/backendAPI';
import Loader from './Loader';

const PlaylistCreator = () => {
  const [files, setFiles] = useState([]);
  const [playlistName, setPlaylistName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'audio/*': [] } });

  const handleCreatePlaylist = async () => {
    if (!playlistName || files.length === 0) {
      setMessage({ type: 'error', text: 'Please provide a playlist name and at least one audio file.' });
      return;
    }
    setIsLoading(true);
    setMessage(null);
    try {
      // Extract just the filenames without extensions
      const trackNames = files.map(file => file.name.replace(/\.[^/.]+$/, ""));
      const response = await createPlaylistFromFiles(playlistName, trackNames);
      setMessage({
        type: 'success',
        text: (
          <>
            Playlist created! <a href={response.data.playlist_url} target="_blank" rel="noopener noreferrer">Open on Spotify.</a>
            <br />
            Added: {response.data.added} | Not Found: {response.data.notFound}
          </>
        ),
      });
      setFiles([]);
      setPlaylistName('');
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to create the playlist.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tool-card" style={{ position: 'relative' }}>
      {isLoading && <Loader />}
      <h2>Playlist Creator</h2>
      <p>Create a Spotify playlist from your local audio files.</p>
      <div className="form-group">
        <label htmlFor="playlist-name">New Playlist Name:</label>
        <input
          type="text"
          id="playlist-name"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          placeholder="e.g., My Awesome Mix"
          disabled={isLoading}
        />
      </div>

      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        {isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop audio files here, or click to select</p>
        }
      </div>

      {files.length > 0 && (
        <>
          <p>Selected {files.length} files.</p>
          <button onClick={handleCreatePlaylist} className="btn btn-primary" disabled={isLoading}>
            Create Playlist
          </button>
        </>
      )}

      {message && <div className={`message ${message.type}`}>{message.text}</div>}
    </div>
  );
};

export default PlaylistCreator;