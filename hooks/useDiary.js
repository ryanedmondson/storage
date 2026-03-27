import { useEffect, useState } from 'react';
import { getTodayKey, loadDiaryEntries, saveDiaryEntries } from '../storage';

export default function useDiary() {
  const [entries, setEntries] = useState([]);
  const todayKey = getTodayKey();

  useEffect(() => {
    loadDiaryEntries(todayKey).then(setEntries);
  }, []);

  const addEntry = (fields) => {
    const newEntry = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      fields,
    };
    const updated = [...entries, newEntry];
    setEntries(updated);
    saveDiaryEntries(todayKey, updated);
  };

  const deleteEntry = (id) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    saveDiaryEntries(todayKey, updated);
  };

  return { entries, addEntry, deleteEntry };
}
