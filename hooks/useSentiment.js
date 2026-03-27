import { useEffect, useState } from 'react';
import { getTodayKey, loadSentiment, saveSentiment } from '../storage';

export default function useSentiment() {
  const [level, setLevel] = useState(null);
  const todayKey = getTodayKey();

  useEffect(() => {
    loadSentiment(todayKey).then(setLevel);
  }, []);

  const selectLevel = (picked) => {
    // Tapping the current level deselects it
    const next = picked === level ? null : picked;
    setLevel(next);
    saveSentiment(todayKey, next);
  };

  return { level, selectLevel };
}
