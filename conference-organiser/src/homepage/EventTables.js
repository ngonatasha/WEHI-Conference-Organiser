import React from 'react';
import '../App.css';
import { timeZoneAbbreviations } from './time';

const EventTables = ({ userTimeZone }) => {
  const isValidTimeZone = (tz) => {
    try {
      Intl.DateTimeFormat(undefined, { timeZone: tz });
      return true;
    } catch (e) {
      return false;
    }
  };

  const formatDateTime = (isoDate) => {
    let timeZone = userTimeZone;

    if (!isValidTimeZone(timeZone)) {
      console.error(`Invalid time zone specified: ${timeZone}`);
      timeZone = 'UTC'; // Fallback to UTC if the time zone is invalid
    }

    const options = {
      timeZone: timeZone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    };
    const date = new Date(isoDate);
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    const timeZoneAbbr = timeZoneAbbreviations[timeZone] || timeZone;
    return `${formattedDate} ${timeZoneAbbr}`;
  };

  return (
    <div>
      {/* Key dates table */}
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
            <td className="event-date" data-date="2024-06-19T02:00:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>
              {formatDateTime('2024-06-19T02:00:00Z')} (Wednesday)
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Start of registration and scholarships and micro-grant applications</td>
          </tr>
          <tr>
            <td className="event-date" data-date="2024-07-26T07:00:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>
              {formatDateTime('2024-07-26T07:00:00Z')} (Friday) – Date extended!
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>End of scholarship and micro-grant applications</td>
          </tr>
          <tr>
            <td className="event-date" data-date="2024-08-14T02:00:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>
              {formatDateTime('2024-08-14T02:00:00Z')} (Wednesday)
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>End of poster submission for eligible scholarship and micro-grant applicants and end of early bird registrations</td>
          </tr>
          <tr>
            <td className="event-date" data-date="2024-09-06T02:00:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>
              {formatDateTime('2024-09-06T02:00:00Z')} (Friday)
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>End of registration</td>
          </tr>
          <tr>
            <td className="event-date" data-date="2024-09-10T02:30:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>
              {formatDateTime('2024-09-10T02:30:00Z')} (Tuesday)
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Leaders forum</td>
          </tr>
          <tr>
            <td className="event-date" data-date="2024-09-11T02:30:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>
              {formatDateTime('2024-09-11T02:30:00Z')} (Wednesday)
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Start of Day 1 of the unconference</td>
          </tr>
          <tr>
            <td className="event-date" data-date="2024-09-12T02:30:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>
              {formatDateTime('2024-09-12T02:30:00Z')} (Thursday)
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Start of Day 2 of the unconference</td>
          </tr>
          <tr>
            <td className="event-date" data-date="2024-09-13T02:30:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>
              {formatDateTime('2024-09-13T02:30:00Z')} (Friday)
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Start of day 3 and end of discussion topic submissions</td>
          </tr>
        </tbody>
      </table>

      {/* Schedule table */}
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
            <td className="event-time" data-time="2024-09-10T02:30:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>
              {formatDateTime('2024-09-10T02:30:00Z')}
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Opportunity to meet informally</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Opportunity to meet informally</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Opportunity to meet informally</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Opportunity to meet informally</td>
          </tr>
          <tr>
            <td className="event-time" data-time="2024-09-10T03:00:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>
              {formatDateTime('2024-09-10T03:00:00Z')}
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Welcome, Vision and Survey</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Welcome, Vision, Explanation, and Partners</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Explain, Review</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Explain, Review</td>
          </tr>
          <tr>
            <td className="event-time" data-time="2024-09-10T03:30:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>
              {formatDateTime('2024-09-10T03:30:00Z')}
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Introductions</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Keynote 1</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Keynote 2</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Strategy and Policy Panel</td>
          </tr>
          <tr>
            <td className="event-time" data-time="2024-09-10T04:00:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>
              {formatDateTime('2024-09-10T04:00:00Z')}
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Initial Leaders Session</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>First Session</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Third Session</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Strategy and Policy Panel</td>
          </tr>
          <tr>
            <td className="event-time" data-time="2024-09-10T04:30:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>
              {formatDateTime('2024-09-10T04:30:00Z')}
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Initial Leaders Session</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>First Session</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Third Session</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Strategy and Policy Panel</td>
          </tr>
          <tr>
            <td className="event-time" data-time="2024-09-10T05:00:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>
              {formatDateTime('2024-09-10T05:00:00Z')}
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Break</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Break</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Break</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Break</td>
          </tr>
          <tr>
            <td className="event-time" data-time="2024-09-10T05:30:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>
              {formatDateTime('2024-09-10T05:30:00Z')}
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Second Leaders Session</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Second Session</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Poster Session</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Actionable items</td>
          </tr>
          <tr>
            <td className="event-time" data-time="2024-09-10T06:00:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>
              {formatDateTime('2024-09-10T06:00:00Z')}
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Second Leaders Session</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Second Session</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Poster Session</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Actionable items</td>
          </tr>
          <tr>
            <td className="event-time" data-time="2024-09-10T06:30:00Z" style={{ border: '1px solid #ddd', padding: '8px', color: 'blue' }}>
              {formatDateTime('2024-09-10T06:30:00Z')}
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Review and discussion</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Review and discussion</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Review and discussion</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>Close and thank you</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default EventTables;
