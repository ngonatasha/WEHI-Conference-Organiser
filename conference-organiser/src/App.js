import React from 'react';
import banner from './assets/conference_banner_small_website.png';
import { useNavigate, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import EventTables from './pages/homepage/eventTables';
import WorldMap from "react-svg-worldmap";
import mapData from './pages/homepage/mapData';
import { useTime } from './pages/homepage/time';
import { useButtonHandlers } from './utils/buttonHandling';
import CreatePollQuestion from './pages/adminPollPage/createPollQuestion';

// Pages
import AdminPollPage from './pages/adminPollPage/adminPollPage'; // Not sure why its red
import AdminPage from './pages/AdminPage';
import PollPage from './pages/poll/poll';
import ResultsPage from './pages/results/Results';


function App() {
  const { currentTime, userTimeZone } = useTime(); // Timezone handling
  const { handleHomeButton, handlePollAdminAccess, handlePollAccess, handleAdminAcess } = useButtonHandlers();  // Button handling


  // HTML Code for the homepage
  return (
    <div className="container">
      <h1>RSEAA24 - A research software community event for Asia and Australia</h1>

      <div className="buttonContainer">
        <button onClick={handleHomeButton} className="buttons">
          Homepage
        </button>
        <button onClick={handleAdminAcess} className="buttons">
          Admin
        </button>
        <button onClick={handlePollAccess} className="buttons">
          Poll
        </button>
      </div>

      <img src={banner} alt="Conference Banner" className="conference-banner" />
      <div id="time" className="time-display">
        Current Time: {currentTime}
      </div>

      <EventTables userTimeZone={userTimeZone} />

      <h2 className="sub-title">Where is everyone attending from?</h2>
      <div className="Map">
        <WorldMap
          color="purple"
          valueSuffix=" intensity level"
          size="xl"
          data={mapData}
        />
      </div>
    </div>
  );
}

// Manages routing of pages
function AppWrapper() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/adminPollPage" element={<AdminPollPage />} />
        <Route path="/pollPage" element={<PollPage />} />
        <Route path="/create-poll" element={<CreatePollQuestion />} />
        <Route path="/adminPage" element={<AdminPage />} />
        <Route path="/resultsPage" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
}

export default AppWrapper;
