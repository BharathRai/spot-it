Spot-IT: Your Personal Spotify Dashboard 🎵
Spot-IT is a web application that provides a dashboard with powerful tools to manage your Spotify library. This version is a public utility where users connect their own Spotify Developer credentials to safely manage their playlists.

Live Demo: You can use the live application here: https://spot-it-frontend.onrender.com/ (Replace with your actual deployed frontend URL)

## Features
Playlist Cleaner: Scan any of your playlists to find and remove duplicate tracks with a single click.

Weekly Archiver: Automatically save your "Discover Weekly" and "Release Radar" playlists to a permanent archive before they are refreshed each week.

Playlist Creator: Generate a new Spotify playlist based on a folder of your local audio files.

## Tech Stack
Frontend: React, Axios

Backend: Node.js, Express.js, Express Session

Deployment: Render

## Usage and Setup
There are two ways to use this application: as an end-user on the deployed website, or as a developer running it locally.

### For End-Users (Using the Live App)
To use the live application, you need to provide your own Spotify API keys. This ensures the application only has permission to access your library while you are using it.

Go to the Spotify Developer Dashboard: https://developer.spotify.com/dashboard

Log in and click "Create app". Give it any name and description (e.g., "Spot-IT Tool").

Once created, you will see your Client ID and a button to show your Client Secret. Keep this page open.

Go to the Spot-IT live application URL. The login page will show you a Redirect URI that you must copy.

It will look something like this: https://spot-it-backend.onrender.com/auth/callback

Go back to your Spotify Developer Dashboard and click "Edit settings". Paste the copied Redirect URI into the "Redirect URIs" field, click "Add", and then "Save".

Now, copy your Client ID and Client Secret from the Spotify dashboard and paste them into the form on the Spot-IT login page.

Click "Configure Credentials" and then log in!

### For Developers (Running Locally)
Clone the repository:

Bash

git clone https://github.com/BharathRai/spot-it.git
cd spot-it
Backend Setup:

Navigate to the backend folder: cd backend

Install dependencies: npm install

Create an environment file from the example: cp .env.example .env

Edit the .env file with your local settings:

Ini, TOML

REDIRECT_URI=http://localhost:5000/auth/callback
FRONTEND_URL=http://localhost:3000
PORT=5000
SESSION_SECRET=your_super_secret_session_key
Start the backend server: npm start

Frontend Setup:

Open a new terminal and navigate to the frontend folder: cd frontend

Install dependencies: npm install

Create a .env file and add your backend URL:

Ini, TOML

REACT_APP_BACKEND_URL=http://localhost:5000
Start the frontend server: npm start

Open your browser and go to http://localhost:3000.
