import { useEffect, useState } from 'react';
import config from '../config';
import {
  getAllStorageKeys,
  getSessionKey,
  loadCompletions,
  loadDefinitions,
  loadDiaryEntries,
  loadEventLog,
  loadFixedCompletions,
  loadSentiment,
} from '../storage';

function buildTodos(definitions, completions, fixedCompletions) {
  if (!definitions) return {};
  const result = { a: { fixed: [], daily: [] }, b: { fixed: [], daily: [] } };
  for (const def of definitions) {
    if (def.isSuggested && !def.enabled) continue;
    const done =
      def.type === 'fixed'
        ? !!fixedCompletions[def.mode]?.[def.id]
        : !!completions[def.id];
    result[def.mode][def.type].push({ label: def.label, completed: done });
  }
  return result;
}

function sessionToTime(sessionKey) {
  const num = parseInt(sessionKey.replace('session_', ''), 10);
  return new Date(num * config.timings.dailyIntervalMinutes * 60 * 1000);
}

async function getAllSessionKeys() {
  const allKeys = await getAllStorageKeys();
  const seen = new Set();
  for (const key of allKeys) {
    const match = key.match(/(session_\d+)$/);
    if (match) seen.add(match[1]);
  }
  // Sort newest first
  return Array.from(seen).sort((a, b) => {
    const numA = parseInt(a.replace('session_', ''), 10);
    const numB = parseInt(b.replace('session_', ''), 10);
    return numB - numA;
  });
}

export default function useDailyState() {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    setIsLoading(true);
    const [sessionKeys, definitions, fixedA, fixedB] = await Promise.all([
      getAllSessionKeys(),
      loadDefinitions(),
      loadFixedCompletions('a'),
      loadFixedCompletions('b'),
    ]);

    const currentKey = getSessionKey(config.timings.dailyIntervalMinutes);

    const results = await Promise.all(
      sessionKeys.map(async (key) => {
        const isCurrent = key === currentKey;
        const [sentiment, completions, diary, events] = await Promise.all([
          loadSentiment(key),
          loadCompletions(key),
          loadDiaryEntries(key),
          loadEventLog(key),
        ]);

        // Fixed completions only meaningful for current session
        const fixed = isCurrent ? { a: fixedA, b: fixedB } : { a: {}, b: {} };
        const todos = buildTodos(definitions, completions, fixed);

        const anyTodosChecked =
          Object.values(completions).some(Boolean) ||
          (isCurrent && (Object.values(fixedA).some(Boolean) || Object.values(fixedB).some(Boolean)));

        const isEmpty =
          sentiment === null && !anyTodosChecked && diary.length === 0 && events.length === 0;

        if (isEmpty) return null;

        return {
          key,
          isCurrent,
          startTime: sessionToTime(key),
          sentiment,
          todos,
          diary,
          events,
        };
      })
    );

    setSessions(results.filter(Boolean));
    setIsLoading(false);
  };

  useEffect(() => { load(); }, []);

  return { sessions, isLoading, reload: load };
}
