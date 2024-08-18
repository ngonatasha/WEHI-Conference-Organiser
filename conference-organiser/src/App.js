import React, { useState, useEffect } from 'react';
import banner from './assets/conference_banner_small_website.png';
import './App.css';

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
  'Australia/Sydney': 'AEST',
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

    const updateEventDates = () => {
      const eventDates = document.querySelectorAll('.event-date');
      eventDates.forEach(dateElement => {
        const utcDate = dateElement.getAttribute('data-date');
        const eventDate = new Date(utcDate);

        const options = {
          timeZone: userTimeZone,
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          weekday: 'long'
        };

        const formattedDate = new Intl.DateTimeFormat('en-US', options).format(eventDate);
        const timeZoneAbbr = timeZoneAbbreviations[userTimeZone] || userTimeZone;
        dateElement.textContent = `${formattedDate} ${timeZoneAbbr}`;
      });
    };

    const updateEventTimes = () => {
      const eventTimes = document.querySelectorAll('.event-time');
      eventTimes.forEach(timeElement => {
        const utcTime = timeElement.getAttribute('data-time');
        const eventTime = new Date(utcTime);

        const options = {
          timeZone: userTimeZone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        };

        const formattedTime = new Intl.DateTimeFormat('en-US', options).format(eventTime);
        const timeZoneAbbr = timeZoneAbbreviations[userTimeZone] || userTimeZone;
        timeElement.textContent = `${formattedTime} ${timeZoneAbbr}`;
      });
    };

    updateTimeDisplay();
    updateEventDates();
    updateEventTimes();

    const intervalId = setInterval(updateTimeDisplay, 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ padding: '30px', fontFamily: 'Roboto, sans-serif' }}>
      <h1 style={{ color: '#571845' }}>
        RSEAA24 - A research software community event for Asia and Australia
      </h1>
      <img src={banner} alt="Conference Banner" className="conference-banner" />

      <div id="time" style={{ fontSize: '24px', margin: '20px 0' }}>
        Current Time: {currentTime}
      </div>

      {/* Key dates */}
      <h2>Key Dates</h2>
      <table id="key-dates" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Dates</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Deadlines/Events</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="event-date" data-date="2024-06-19T02:00:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>19th June 12pm UTC+10 (Wednesday)</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Start of registration and scholarships and micro-grant applications</td>
          </tr>
          <tr>
            <td className="event-date" data-date="2024-07-26T07:00:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>26th July 5pm UTC+10 (Friday) – Date extended!</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>End of scholarship and micro-grant applications</td>
          </tr>
          <tr>
            <td className="event-date" data-date="2024-08-14T02:00:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>14th August 12pm UTC+10 (Wednesday)</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>End of poster submission for eligible scholarship and micro-grant applicants and end of early bird registrations</td>
          </tr>
          <tr>
            <td className="event-date" data-date="2024-09-06T02:00:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>6th September 12pm UTC+10 (Friday)</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>End of registration</td>
          </tr>
          <tr>
            <td className="event-date" data-date="2024-09-10T02:30:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>10th September 12:30pm UTC+10 (Tuesday)</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Leaders forum</td>
          </tr>
          <tr>
            <td className="event-date" data-date="2024-09-11T02:30:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>11th September 12:30pm UTC+10 (Wednesday)</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Start of Day 1 of the unconference</td>
          </tr>
          <tr>
            <td className="event-date" data-date="2024-09-12T02:30:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>12th September 12:30pm UTC+10 (Thursday)</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Start of Day 2 of the unconference</td>
          </tr>
          <tr>
            <td className="event-date" data-date="2024-09-13T02:30:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>13th September 12:30pm UTC+10 (Friday)</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Start of day 3 and end of discussion topic submissions</td>
          </tr>
        </tbody>
      </table>

      <h2>Schedule</h2>
      <table id="event-schedule" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Time</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Leaders Forum - Tue 10th Sep 2024</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Day 1 - Wed 11th Sep 2024</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Day 2 - Thu 12th Sep 2024</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f2f2f2' }}>Day 3 - Fri 13th Sep 2024</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="event-time" data-time="2024-09-10T02:30:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>12:30 PM</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Opportunity to meet informally</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Opportunity to meet informally</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Opportunity to meet informally</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Opportunity to meet informally</td>
          </tr>
          <tr>
            <td className="event-time" data-time="2024-09-10T03:00:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>1:00 PM</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Welcome, Vision and Survey</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Welcome, Vision, Explanation, and Partners</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Explain, Review</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Explain, Review</td>
          </tr>
          <tr>
            <td className="event-time" data-time="2024-09-10T03:30:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>1:30 PM</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Introductions</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Keynote 1</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Keynote 2</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Strategy and Policy Panel</td>
          </tr>
          <tr>
            <td className="event-time" data-time="2024-09-10T04:00:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>2:00 PM</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Initial Leaders Session</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>First Session</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Third Session</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Strategy and Policy Panel</td>
          </tr>
          <tr>
            <td className="event-time" data-time="2024-09-10T04:30:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>2:30 PM</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Initial Leaders Session</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>First Session</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Third Session</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Strategy and Policy Panel</td>
          </tr>
          <tr>
            <td className="event-time" data-time="2024-09-10T05:00:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>3:00 PM</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Break</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Break</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Break</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Break</td>
          </tr>
          <tr>
            <td className="event-time" data-time="2024-09-10T05:30:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>3:30 PM</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Second Leaders Session</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Second Session</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Poster Session</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Actionable items</td>
          </tr>
          <tr>
            <td className="event-time" data-time="2024-09-10T06:00:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>4:00 PM</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Second Leaders Session</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Second Session</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Poster Session</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Actionable items</td>
          </tr>
          <tr>
            <td className="event-time" data-time="2024-09-10T06:30:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>4:30 PM</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Review and discussion</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Review and discussion</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Review and discussion</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Close and thank you</td>
          </tr>
        </tbody>
      </table>

      /* TODO Add the map stuff here!! */
       <h2 className="sub-title">Where is everyone attending from?</h2>
    </div>
    
  );
}

export default App;
