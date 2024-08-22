import { useState, useEffect } from 'react';

export const timeZoneAbbreviations = {
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

export function useTime() {
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

  return { currentTime, userTimeZone };
}
