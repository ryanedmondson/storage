import { useEffect, useState } from 'react';
import config from '../config';
import { getSessionKey, loadEventLog, saveEventLog } from '../storage';

export default function useEventLog() {
  const [events, setEvents] = useState([]);
  const todayKey = getSessionKey(config.timings.dailyIntervalMinutes);

  useEffect(() => {
    loadEventLog(todayKey).then(setEvents);
  }, []);

  const logEvent = (score) => {
    const updated = [...events, { id: Date.now(), score, loggedAt: new Date().toISOString() }];
    setEvents(updated);
    saveEventLog(todayKey, updated);
  };

  return { events, logEvent };
}
