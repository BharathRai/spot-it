import React from 'react';
import { logout } from '../api/backendAPI';
import PlaylistCleaner from './PlaylistCleaner';
import WeeklyArchiver from './WeeklyArchiver';
import PlaylistCreator from './PlaylistCreator';

const Dashboard = () => {
  const handleLogout = async () => {
    try {
      await logout();
      window.location.reload(); // Easiest way to reset state and redirect
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Could not log you out. Please try again.");
    }
  };

  return (
    <>
      <header className="header">
        <h1>Spot-IT</h1>
        <button onClick={handleLogout} className="btn btn-secondary">
          Logout
        </button>
      </header>
      <main className="container">
        <div className="dashboard-grid">
          <PlaylistCleaner />
          <WeeklyArchiver />
          <PlaylistCreator />
        </div>
      </main>
    </>
  );
};

export default Dashboard;