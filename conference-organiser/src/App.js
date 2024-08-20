import React, { useState, useEffect } from 'react';
import banner from './assets/conference_banner_small_website.png';
import './App.css';

import EventTables from './EventTables';
import WorldMap from "react-svg-worldmap";
import timeZoneAbbreviations from './timeZoneAbbreviations';


const mapData = [
  { country: "cn", value: 14 }, // China
  { country: "in", value: 13 }, // India
  { country: "us", value: 12 }, // United States
  { country: "id", value: 10 }, // Indonesia
  { country: "pk", value: 9 },  // Pakistan
  { country: "br", value: 8 },  // Brazil
  { country: "ng", value: 7 },  // Nigeria
  { country: "bd", value: 6 },  // Bangladesh
  { country: "ru", value: 5 },  // Russia
  { country: "mx", value: 4 },  // Mexico
];         

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

      <EventTables userTimeZone={userTimeZone} />
      
      <h2 className="sub-title">Where is everyone attending from?</h2>
      <div className="Map">
      <WorldMap
        color="red"
        valueSuffix=" intensity level"
        size="lg"
        data={mapData}
      />
    </div>
    </div>
  );
}

export default App;
