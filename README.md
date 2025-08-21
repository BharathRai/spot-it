<div align="center">
  <a href="https://github.com/BharathRai/spot-it">
    <b>Spot-IT</b>
  </a>
  <h1 align="center">Spot-IT: Your Personal Spotify Dashboard 🎵</h1>
  <p align="center">
    Spot-IT is a web application that provides a dashboard with powerful tools to manage your Spotify library.  
    This version is a public utility where users connect their own Spotify Developer credentials to safely manage their playlists.
    <br /><br />
    <a href="https://spot-it-frontend.onrender.com/">🌐 Live Website</a>
    ·
    <a href="https://github.com/BharathRai/spot-it/issues">🐞 Report Bug</a>
    ·
    <a href="https://github.com/BharathRai/spot-it/issues">✨ Request Feature</a>
  </p>
</div>

---

## ✨ Features

- **Playlist Cleaner** 🧹  
  Scan any of your playlists to find and remove duplicate tracks with a single click.  

- **Weekly Archiver** 💾  
  Automatically save your *Discover Weekly* and *Release Radar* playlists to a permanent archive before they refresh each week.  

- **Playlist Creator** 🎶  
  Generate a new Spotify playlist based on a folder of your local audio files.  

---

## 🛠️ Tech Stack

<p align="left">
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Badge">
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge" alt="Axios Badge">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js Badge">
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js Badge">
  <img src="https://img.shields.io/badge/Render-4682B4?style=for-the-badge&logo=render&logoColor=white" alt="Render Badge">
</p>

**Frontend:** React, Axios  
**Backend:** Node.js, Express.js, Express Session  
**Deployment:** Render  

---

## 🚀 Usage and Setup

There are two ways to use this application:  

1. **End-Users** → Use the deployed web app.  
2. **Developers** → Run it locally.  

---

### 🧑‍💻 For End-Users (Using the Live App)

⚠️ **Important:** You must provide your **own Spotify API keys**.  
This ensures the app only has permission to access your library during use.

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).  
2. Log in and click **"Create app"** → give it a name/description (e.g., *Spot-IT Tool*).  
3. Copy your **Client ID** and **Client Secret**.  
4. Open the [Spot-IT Live App](https://spot-it-frontend.onrender.com/).  
   On the login page, you’ll see a **Redirect URI** (e.g. `https://spot-it-backend.onrender.com/auth/callback`).  
5. In the Spotify Dashboard → **Edit Settings** → paste the Redirect URI → Save.  
6. Enter your **Client ID** and **Client Secret** on the Spot-IT login page.  
7. Click **Configure Credentials** → **Login with Spotify** → start using Spot-IT 🎶.  

---

### 💻 For Developers (Running Locally)

#### Clone the repository
```sh
git clone https://github.com/BharathRai/spot-it.git
cd spot-it
Backend Setup
sh
Copy code
cd backend
npm install
cp .env.example .env
Edit .env with your local settings:

env
Copy code
REDIRECT_URI=http://localhost:5000/auth/callback
FRONTEND_URL=http://localhost:3000
PORT=5000
SESSION_SECRET=your_super_secret_session_key
Start backend:

sh
Copy code
npm start
Frontend Setup
Open a new terminal:

sh
Copy code
cd frontend
npm install
Create .env:

env
Copy code
REACT_APP_BACKEND_URL=http://localhost:5000
Start frontend:

sh
Copy code
npm start
Now open 👉 http://localhost:3000
