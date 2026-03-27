import { useEffect, useState } from 'react';
import config from '../config';
import {
  getTodayKey,
  loadCompletions,
  loadDefinitions,
  saveCompletions,
  saveDefinitions,
} from '../storage';

export default function useTodos() {
  const [definitions, setDefinitions] = useState([]);
  const [completions, setCompletions] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const todayKey = getTodayKey();

  useEffect(() => {
    (async () => {
      let defs = await loadDefinitions();

      if (!defs) {
        // First launch — seed from config
        defs = config.suggestedTodos.map((s) => ({
          id: s.id,
          mode: s.mode,
          label: s.label,
          isSuggested: true,
          enabled: true,
        }));
      } else {
        // Merge any new suggested todos added in config since last launch
        const existingIds = new Set(defs.map((d) => d.id));
        for (const s of config.suggestedTodos) {
          if (!existingIds.has(s.id)) {
            defs.push({ id: s.id, mode: s.mode, label: s.label, isSuggested: true, enabled: true });
          }
        }
      }

      await saveDefinitions(defs);
      setDefinitions(defs);
      setCompletions(await loadCompletions(todayKey));
      setIsLoaded(true);
    })();
  }, []);

  const todosForMode = (mode) =>
    definitions.filter((d) => d.mode === mode && (!d.isSuggested || d.enabled));

  const toggleCompletion = (id) => {
    const updated = { ...completions, [id]: !completions[id] };
    setCompletions(updated);
    saveCompletions(todayKey, updated);
  };

  const toggleSuggested = (id) => {
    const updated = definitions.map((d) => (d.id === id ? { ...d, enabled: !d.enabled } : d));
    setDefinitions(updated);
    saveDefinitions(updated);
  };

  const addCustomTodo = (mode, label) => {
    const newDef = {
      id: `custom_${Date.now()}`,
      mode,
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
    todosForMode,
    toggleCompletion,
    toggleSuggested,
    addCustomTodo,
    deleteCustomTodo,
  };
}
