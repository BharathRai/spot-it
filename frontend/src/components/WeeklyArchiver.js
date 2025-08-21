import React, { useState } from 'react';
import { archiveWeeklyPlaylist } from '../api/backendAPI';
import Loader from './Loader';

const WeeklyArchiver = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleArchive = async (type) => {
    setIsLoading(true);
    setMessage(null);
    try {
      const response = await archiveWeeklyPlaylist(type);
      setMessage({
        type: 'success',
        text: (
          <>
            Successfully archived to <a href={response.data.playlist_url} target="_blank" rel="noopener noreferrer">{response.data.name}</a>!
          </>
        ),
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || `Failed to archive ${type}.` });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="tool-card" style={{ position: 'relative' }}>
      {isLoading && <Loader />}
      <h2>Weekly Archiver</h2>
      <p>Save your Discover Weekly and Release Radar playlists before they update.</p>
      
      <button onClick={() => handleArchive('Discover Weekly')} className="btn btn-primary" disabled={isLoading}>
        Archive Discover Weekly
      </button>
      <button onClick={() => handleArchive('Release Radar')} className="btn btn-primary" disabled={isLoading}>
        Archive Release Radar
      </button>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}
    </div>
  );
};

export default WeeklyArchiver;