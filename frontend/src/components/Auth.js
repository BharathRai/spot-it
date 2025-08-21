import React, { useState } from 'react';
import { configureCredentials } from '../api/backendAPI';
import Loader from './Loader';

const Auth = () => {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientId || !clientSecret) {
      setError('Please provide both a Client ID and a Client Secret.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await configureCredentials(clientId, clientSecret);
      setIsConfigured(true);
    } catch (err) {
      setError('Could not verify credentials. Please check them and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isConfigured) {
    return (
      <div className="auth-container">
        <h1>Spot-IT</h1>
        <p>Configuration successful! You can now log in.</p>
        <a href={`${backendUrl}/auth/login`} className="btn btn-primary">
          Login with Spotify
        </a>
      </div>
    );
  }

  return (
    <div className="auth-container" style={{ maxWidth: '600px', margin: 'auto', textAlign: 'left', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center' }}>Welcome to Spot-IT</h1>
      <p style={{ textAlign: 'center', color: '#B3B3B3' }}>
        To use this tool, you need to provide your own Spotify API credentials.
      </p>
      
      <div className="tool-card">
        <h3>Instructions</h3>
        <p>
          1. Go to your <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noopener noreferrer">Spotify Developer Dashboard</a>.
        </p>
        <p>
          2. Create an app, then click **"Edit settings"**.
        </p>
        <p>
          3. Copy your **Client ID** and **Client Secret** into the fields below.
        </p>
        <p>
          4. In the **Redirect URIs** field on the Spotify dashboard, you **must** add this exact URL:
          <input 
            type="text" 
            readOnly 
            value={`${backendUrl}/auth/callback`} 
            onClick={(e) => e.target.select()} 
            style={{ marginTop: '0.5rem' }} 
          />
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        <div className="form-group">
          <label htmlFor="clientId">Client ID</label>
          <input
            type="text"
            id="clientId"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div className="form-group" style={{ marginTop: '1rem' }}>
          <label htmlFor="clientSecret">Client Secret</label>
          <input
            type="password"
            id="clientSecret"
            value={clientSecret}
            onChange={(e) => setClientSecret(e.target.value)}
            disabled={isLoading}
          />
        </div>
        {error && <div className="message error">{error}</div>}
        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }} disabled={isLoading}>
          {isLoading ? 'Configuring...' : 'Configure Credentials'}
        </button>
      </form>
      {isLoading && <Loader />}
    </div>
  );
};

export default Auth;