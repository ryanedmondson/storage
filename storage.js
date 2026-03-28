import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Storage backend (SQLite on native, AsyncStorage on web) ───────────────────

const isNative = Platform.OS !== 'web';

// SQLite singleton
let _dbPromise = null;
function getDb() {
  if (!_dbPromise) {
    _dbPromise = (async () => {
      const db = await SQLite.openDatabaseAsync('app.db');
      await db.execAsync(
        'CREATE TABLE IF NOT EXISTS kv_store (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);'
      );
      return db;
    })();
  }
  return _dbPromise;
}

async function kvGet(key) {
  if (!isNative) return AsyncStorage.getItem(key);
  const db = await getDb();
  const row = await db.getFirstAsync('SELECT value FROM kv_store WHERE key = ?;', [key]);
  return row ? row.value : null;
}

async function kvSet(key, value) {
  if (!isNative) { await AsyncStorage.setItem(key, value); return; }
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO kv_store (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value;',
    [key, value]
  );
}

export async function getAllStorageKeys() {
  if (!isNative) return AsyncStorage.getAllKeys();
  const db = await getDb();
  const rows = await db.getAllAsync('SELECT key FROM kv_store;');
  return rows.map((r) => r.key);
}

// ── Key helpers ────────────────────────────────────────────────────────────────

export const getTodayKey = () => new Date().toISOString().slice(0, 10);

export const getSessionKey = (intervalMinutes) =>
  `session_${Math.floor(Date.now() / (intervalMinutes * 60 * 1000))}`;

// ── Storage functions ──────────────────────────────────────────────────────────

export async function loadMode() {
  return await kvGet('mode');
}

export async function saveMode(mode) {
  await kvSet('mode', mode);
}

export async function loadFixedCompletions(mode) {
  const raw = await kvGet(`fixed_completions_${mode}`);
  return raw ? JSON.parse(raw) : {};
}

export async function saveFixedCompletions(mode, completions) {
  await kvSet(`fixed_completions_${mode}`, JSON.stringify(completions));
}

export async function loadDefinitions() {
  const raw = await kvGet('todo_definitions');
  return raw ? JSON.parse(raw) : null;
}

export async function saveDefinitions(defs) {
  await kvSet('todo_definitions', JSON.stringify(defs));
}

export async function loadCompletions(dateKey) {
  const raw = await kvGet(`completions_${dateKey}`);
  return raw ? JSON.parse(raw) : {};
}

export async function saveCompletions(dateKey, completions) {
  await kvSet(`completions_${dateKey}`, JSON.stringify(completions));
}

export async function loadReminderDefs() {
  const raw = await kvGet('reminder_defs');
  return raw ? JSON.parse(raw) : null;
}

export async function saveReminderDefs(defs) {
  await kvSet('reminder_defs', JSON.stringify(defs));
}

export async function loadReminderCompletions() {
  const raw = await kvGet('reminder_completions');
  return raw ? JSON.parse(raw) : {};
}

export async function saveReminderCompletions(completions) {
  await kvSet('reminder_completions', JSON.stringify(completions));
}

export async function loadEventLog(dateKey) {
  const raw = await kvGet(`event_log_${dateKey}`);
  return raw ? JSON.parse(raw) : [];
}

export async function saveEventLog(dateKey, events) {
  await kvSet(`event_log_${dateKey}`, JSON.stringify(events));
}

export async function loadDiaryEntries(dateKey) {
  const raw = await kvGet(`diary_${dateKey}`);
  return raw ? JSON.parse(raw) : [];
}

export async function saveDiaryEntries(dateKey, entries) {
  await kvSet(`diary_${dateKey}`, JSON.stringify(entries));
}

export async function loadSentiment(dateKey) {
  const raw = await kvGet(`sentiment_${dateKey}`);
  return raw ? JSON.parse(raw) : null;
}

export async function saveSentiment(dateKey, level) {
  await kvSet(`sentiment_${dateKey}`, JSON.stringify(level));
}
