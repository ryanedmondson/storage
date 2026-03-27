import { useEffect, useState } from 'react';
import config from '../config';
import {
  loadReminderCompletions,
  loadReminderDefs,
  saveReminderCompletions,
  saveReminderDefs,
} from '../storage';

function isDue(reminder, completions) {
  if (!reminder.enabled) return false;
  const lastCompleted = completions[reminder.id];
  if (!lastCompleted) return true;
  const elapsed = Date.now() - new Date(lastCompleted).getTime();
  return elapsed >= reminder.intervalMinutes * 60 * 1000;
}

export default function useReminders() {
  const [reminderDefs, setReminderDefs] = useState([]);
  const [completions, setCompletions] = useState({});

  useEffect(() => {
    (async () => {
      let defs = await loadReminderDefs();

      if (!defs) {
        defs = config.reminders.map((r) => ({
          id: r.id, mode: r.mode, label: r.label,
          intervalMinutes: r.intervalMinutes, isSuggested: true, enabled: true,
        }));
      } else {
        const existingIds = new Set(defs.map((d) => d.id));
        for (const r of config.reminders) {
          if (!existingIds.has(r.id)) {
            defs.push({
              id: r.id, mode: r.mode, label: r.label,
              intervalMinutes: r.intervalMinutes, isSuggested: true, enabled: true,
            });
          }
        }
      }

      await saveReminderDefs(defs);
      setReminderDefs(defs);
      setCompletions(await loadReminderCompletions());
    })();
  }, []);

  // Returns todo-shaped objects ready to merge into the "On activation" list
  const dueRemindersForMode = (mode) =>
    reminderDefs
      .filter((r) => r.mode === mode && isDue(r, completions))
      .map((r) => ({ id: r.id, label: r.label, mode: r.mode, type: 'fixed', isReminder: true }));

  const completeReminder = (id) => {
    const updated = { ...completions, [id]: new Date().toISOString() };
    setCompletions(updated);
    saveReminderCompletions(updated);
  };

  const toggleSuggestedReminder = (id) => {
    const existing = reminderDefs.find((d) => d.id === id);
    let updated;
    if (existing) {
      updated = reminderDefs.map((d) => (d.id === id ? { ...d, enabled: !d.enabled } : d));
    } else {
      const fromConfig = config.reminders.find((r) => r.id === id);
      if (!fromConfig) return;
      updated = [...reminderDefs, {
        id: fromConfig.id, mode: fromConfig.mode, label: fromConfig.label,
        intervalMinutes: fromConfig.intervalMinutes, isSuggested: true, enabled: true,
      }];
    }
    setReminderDefs(updated);
    saveReminderDefs(updated);
  };

  const addCustomReminder = (mode, label, intervalMinutes) => {
    const newDef = {
      id: `reminder_custom_${Date.now()}`,
      mode, label, intervalMinutes, isSuggested: false, enabled: true,
    };
    const updated = [...reminderDefs, newDef];
    setReminderDefs(updated);
    saveReminderDefs(updated);
  };

  const deleteCustomReminder = (id) => {
    const updated = reminderDefs.filter((d) => d.id !== id);
    setReminderDefs(updated);
    saveReminderDefs(updated);
  };

  return {
    reminderDefs,
    dueRemindersForMode,
    completeReminder,
    toggleSuggestedReminder,
    addCustomReminder,
    deleteCustomReminder,
  };
}
