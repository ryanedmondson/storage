import { useEffect, useState } from 'react';
import config from '../config';
import {
  getSessionKey,
  loadCompletions,
  loadDefinitions,
  loadFixedCompletions,
  saveCompletions,
  saveDefinitions,
  saveFixedCompletions,
} from '../storage';

export default function useTodos() {
  const [definitions, setDefinitions] = useState([]);
  const [completions, setCompletions] = useState({});
  const [fixedCompletions, setFixedCompletions] = useState({ a: {}, b: {} });
  const [isLoaded, setIsLoaded] = useState(false);

  // Daily todos reset on a configurable interval; use a fresh key each render so
  // the bucket is always current (saves are always keyed correctly).
  const dailyKey = getSessionKey(config.timings.dailyIntervalMinutes);

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

        defs = defs.map((d) => {
          if (d.isSuggested && configMap.has(d.id)) {
            return { ...d, type: configMap.get(d.id).type };
          }
          return d.type ? d : { ...d, type: 'daily' };
        });

        const existingIds = new Set(defs.map((d) => d.id));
        for (const s of config.suggestedTodos) {
          if (!existingIds.has(s.id)) {
            defs.push({ id: s.id, mode: s.mode, type: s.type, label: s.label, isSuggested: true, enabled: true });
          }
        }
      }

      await saveDefinitions(defs);
      setDefinitions(defs);

      const [daily, fixedA, fixedB] = await Promise.all([
        loadCompletions(getSessionKey(config.timings.dailyIntervalMinutes)),
        loadFixedCompletions('a'),
        loadFixedCompletions('b'),
      ]);
      setCompletions(daily);
      setFixedCompletions({ a: fixedA, b: fixedB });
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
    saveCompletions(dailyKey, updated);
  };

  const toggleFixedCompletion = (mode, id) => {
    const updatedMode = { ...fixedCompletions[mode], [id]: !fixedCompletions[mode][id] };
    setFixedCompletions((prev) => ({ ...prev, [mode]: updatedMode }));
    saveFixedCompletions(mode, updatedMode);
  };

  // Call when switching into a mode — clears that mode's fixed completions
  const activateMode = (mode) => {
    setFixedCompletions((prev) => ({ ...prev, [mode]: {} }));
    saveFixedCompletions(mode, {});
  };

  const toggleSuggested = (id) => {
    const existing = definitions.find((d) => d.id === id);
    let updated;
    if (existing) {
      updated = definitions.map((d) => (d.id === id ? { ...d, enabled: !d.enabled } : d));
    } else {
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
