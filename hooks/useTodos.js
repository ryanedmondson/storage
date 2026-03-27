import { useEffect, useState } from 'react';
import config from '../config';
import {
  getSessionKey,
  loadCompletions,
  loadDefinitions,
  saveCompletions,
  saveDefinitions,
} from '../storage';

export default function useTodos() {
  const [definitions, setDefinitions] = useState([]);
  const [completions, setCompletions] = useState({});
  // Fixed completions are in-memory only — they reset every time a mode is activated
  const [fixedCompletions, setFixedCompletions] = useState({ a: {}, b: {} });
  const [isLoaded, setIsLoaded] = useState(false);
  const todayKey = getSessionKey(config.timings.dailyIntervalMinutes);

  useEffect(() => {
    (async () => {
      let defs = await loadDefinitions();

      if (!defs) {
        defs = config.suggestedTodos.map((s) => ({
          id: s.id,
          mode: s.mode,
          type: s.type,
          label: s.label,
          isSuggested: true,
          enabled: true,
        }));
      } else {
        const configMap = new Map(config.suggestedTodos.map((s) => [s.id, s]));

        // Backfill type, and sync type from config for suggested todos in case it changed
        defs = defs.map((d) => {
          if (d.isSuggested && configMap.has(d.id)) {
            return { ...d, type: configMap.get(d.id).type };
          }
          return d.type ? d : { ...d, type: 'daily' };
        });

        // Merge any new suggested todos added in config since last launch
        const existingIds = new Set(defs.map((d) => d.id));
        for (const s of config.suggestedTodos) {
          if (!existingIds.has(s.id)) {
            defs.push({ id: s.id, mode: s.mode, type: s.type, label: s.label, isSuggested: true, enabled: true });
          }
        }
      }

      await saveDefinitions(defs);
      setDefinitions(defs);
      setCompletions(await loadCompletions(todayKey));
      setIsLoaded(true);
    })();
  }, []);

  const todosForMode = (mode, type) =>
    definitions.filter(
      (d) => d.mode === mode && d.type === type && (!d.isSuggested || d.enabled)
    );

  const toggleCompletion = (id) => {
    const updated = { ...completions, [id]: !completions[id] };
    setCompletions(updated);
    saveCompletions(todayKey, updated);
  };

  const toggleFixedCompletion = (mode, id) => {
    setFixedCompletions((prev) => ({
      ...prev,
      [mode]: { ...prev[mode], [id]: !prev[mode][id] },
    }));
  };

  // Call this when switching into a mode — resets that mode's fixed completions
  const activateMode = (mode) => {
    setFixedCompletions((prev) => ({ ...prev, [mode]: {} }));
  };

  const toggleSuggested = (id) => {
    const existing = definitions.find((d) => d.id === id);
    let updated;
    if (existing) {
      updated = definitions.map((d) => (d.id === id ? { ...d, enabled: !d.enabled } : d));
    } else {
      // Definition missing from state (e.g. stale cache) — pull from config and add it as enabled
      const fromConfig = config.suggestedTodos.find((s) => s.id === id);
      if (!fromConfig) return;
      updated = [
        ...definitions,
        { id: fromConfig.id, mode: fromConfig.mode, type: fromConfig.type, label: fromConfig.label, isSuggested: true, enabled: true },
      ];
    }
    setDefinitions(updated);
    saveDefinitions(updated);
  };

  const addCustomTodo = (mode, label, type) => {
    const newDef = {
      id: `custom_${Date.now()}`,
      mode,
      type,
      label,
      isSuggested: false,
      enabled: true,
    };
    const updated = [...definitions, newDef];
    setDefinitions(updated);
    saveDefinitions(updated);
  };

  const deleteCustomTodo = (id) => {
    const updated = definitions.filter((d) => d.id !== id);
    setDefinitions(updated);
    saveDefinitions(updated);
  };

  return {
    isLoaded,
    definitions,
    completions,
    fixedCompletions,
    todosForMode,
    toggleCompletion,
    toggleFixedCompletion,
    activateMode,
    toggleSuggested,
    addCustomTodo,
    deleteCustomTodo,
  };
}
