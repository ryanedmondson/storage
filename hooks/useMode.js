import { useEffect, useState } from 'react';
import { loadMode, saveMode } from '../storage';

export default function useMode() {
  const [mode, setMode] = useState('a');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadMode().then((saved) => {
      if (saved) setMode(saved);
      setIsLoaded(true);
    }).catch((e) => {
      console.error('useMode load error:', e);
      setIsLoaded(true);
    });
  }, []);

  const updateMode = (next) => {
    setMode(next);
    saveMode(next);
  };

  return { mode, updateMode, isLoaded };
}
