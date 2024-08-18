import React, { useState, useEffect } from 'react';
import banner from './assets/conference_banner_small_website.png';
import './App.css';
import EventTables from './EventTables'; // Import the table component!

const timeZoneAbbreviations = {
  'UTC': 'UTC',
  'America/New_York': 'EDT',
  'America/Chicago': 'CDT',
  'America/Denver': 'MDT',
  'America/Los_Angeles': 'PDT',
  'Europe/London': 'BST',
  'Europe/Paris': 'CEST',
  'Europe/Berlin': 'CEST',
  'Europe/Moscow': 'MSK',
  'Asia/Dubai': 'GST',
  'Asia/Tokyo': 'JST',
  'Asia/Shanghai': 'CST',
  'Asia/Singapore': 'SGT',
  'Australia/Sydney': 'AEDT',
  'Australia/Brisbane': 'AEST',
  'Australia/Adelaide': 'ACDT',
  'Australia/Darwin': 'ACST',
  'Australia/Perth': 'AWST',
  'Asia/Kolkata': 'IST',
  'America/Sao_Paulo': 'BRT',
  'Africa/Johannesburg': 'SAST'
};

function App() {
  const [currentTime, setCurrentTime] = useState('');
  const [userTimeZone, setUserTimeZone] = useState('');

  useEffect(() => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setUserTimeZone(userTimeZone);

    const updateTimeDisplay = () => {
      const options = {
        timeZone: userTimeZone,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      const current = new Intl.DateTimeFormat('en-US', options).format(new Date());
      const timeZoneAbbr = timeZoneAbbreviations[userTimeZone] || userTimeZone;
      setCurrentTime(`${current} ${timeZoneAbbr}`);
    };

    updateTimeDisplay();

    const intervalId = setInterval(updateTimeDisplay, 1000);
    return () => clearInterval(intervalId);
  }, [userTimeZone]);

  return (
    <div className="container">
      <h1>RSEAA24 - A research software community event for Asia and Australia</h1>
      <img src={banner} alt="Conference Banner" className="conference-banner" />

      <div id="time" className="time-display">
        Current Time: {currentTime}
      </div>

      <EventTables /> {}
      {/* TODO Add the map stuff here */}
      <h2 className="sub-title">Where is everyone attending from?</h2>
    </div>
  );
}

export default App;
