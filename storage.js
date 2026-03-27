import AsyncStorage from '@react-native-async-storage/async-storage';

export const getSessionKey = (intervalMinutes) =>
  `session_${Math.floor(Date.now() / (intervalMinutes * 60 * 1000))}`;

export async function loadDefinitions() {
  const raw = await AsyncStorage.getItem('todo_definitions');
  return raw ? JSON.parse(raw) : null;
}

export async function saveDefinitions(defs) {
  await AsyncStorage.setItem('todo_definitions', JSON.stringify(defs));
}

export async function loadCompletions(dateKey) {
  const raw = await AsyncStorage.getItem(`completions_${dateKey}`);
  return raw ? JSON.parse(raw) : {};
}

export async function saveCompletions(dateKey, completions) {
  await AsyncStorage.setItem(`completions_${dateKey}`, JSON.stringify(completions));
}

export async function loadReminderDefs() {
  const raw = await AsyncStorage.getItem('reminder_defs');
  return raw ? JSON.parse(raw) : null;
}

export async function saveReminderDefs(defs) {
  await AsyncStorage.setItem('reminder_defs', JSON.stringify(defs));
}

export async function loadReminderCompletions() {
  const raw = await AsyncStorage.getItem('reminder_completions');
  return raw ? JSON.parse(raw) : {};
}

export async function saveReminderCompletions(completions) {
  await AsyncStorage.setItem('reminder_completions', JSON.stringify(completions));
}

export async function loadDiaryEntries(dateKey) {
  const raw = await AsyncStorage.getItem(`diary_${dateKey}`);
  return raw ? JSON.parse(raw) : [];
}

export async function saveDiaryEntries(dateKey, entries) {
  await AsyncStorage.setItem(`diary_${dateKey}`, JSON.stringify(entries));
}

export async function loadSentiment(dateKey) {
  const raw = await AsyncStorage.getItem(`sentiment_${dateKey}`);
  return raw ? JSON.parse(raw) : null;
}

export async function saveSentiment(dateKey, level) {
  await AsyncStorage.setItem(`sentiment_${dateKey}`, JSON.stringify(level));
}
