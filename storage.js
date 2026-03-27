import AsyncStorage from '@react-native-async-storage/async-storage';

export const getTodayKey = () => new Date().toISOString().slice(0, 10);

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
