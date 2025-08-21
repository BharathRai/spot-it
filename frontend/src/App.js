import React, { useState, useEffect } from 'react';
import { checkLoginStatus } from './api/backendAPI';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
        try {
            const response = await checkLoginStatus(); // Get the full response
            setIsLoggedIn(response.data.loggedIn);    // Look inside response.data
          } catch (error) {
        console.error("Auth check failed:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };
    verifyUser();
  }, []);

  if (isLoading) {
    return (
      <div className="App" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="App">
      {isLoggedIn ? <Dashboard /> : <Auth />}
    </div>
  );
}

export default App;