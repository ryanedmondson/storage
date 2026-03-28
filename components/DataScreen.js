import { useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import config from '../config';
import useDailyState from '../hooks/useDailyState';

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function fmtSessionTime(date) {
  return date.toLocaleString([], {
    month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ── Shared card shell ─────────────────────────────────────────────────────────

function Card({ title, children }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

// ── Section components ────────────────────────────────────────────────────────

function SentimentCard({ value }) {
  return (
    <Card title={config.sentiment.label}>
      {value === null ? (
        <Text style={styles.empty}>Not recorded</Text>
      ) : (
        <View style={styles.sentimentRow}>
          <Text style={styles.sentimentScore}>{value}</Text>
          <Text style={styles.sentimentDenom}>/5</Text>
          <View style={styles.bar}>
            {[1, 2, 3, 4, 5].map((n) => (
              <View key={n} style={[styles.seg, n <= value && styles.segFilled]} />
            ))}
          </View>
        </View>
      )}
    </Card>
  );
}

function TodoRow({ todo }) {
  return (
    <View style={styles.todoRow}>
      <Text style={todo.completed ? styles.todoCheck : styles.todoCircle}>
        {todo.completed ? '✓' : '○'}
      </Text>
      <Text style={[styles.todoLabel, todo.completed && styles.todoLabelDone]}>
        {todo.label}
      </Text>
    </View>
  );
}

function TodosCard({ todos }) {
  const hasTodos = ['a', 'b'].some(
    (m) => todos[m]?.fixed?.length > 0 || todos[m]?.daily?.length > 0
  );
  if (!hasTodos) return null;
  return (
    <Card title="To-dos">
      {['a', 'b'].map((m) => {
        const fixed = todos[m]?.fixed ?? [];
        const daily = todos[m]?.daily ?? [];
        if (!fixed.length && !daily.length) return null;
        return (
          <View key={m} style={styles.todoMode}>
            <Text style={styles.todoModeLabel}>{config.modes[m]}</Text>
            {fixed.length > 0 && <>
              <Text style={styles.typeLabel}>On activation</Text>
              {fixed.map((t, i) => <TodoRow key={i} todo={t} />)}
            </>}
            {daily.length > 0 && <>
              <Text style={styles.typeLabel}>Daily</Text>
              {daily.map((t, i) => <TodoRow key={i} todo={t} />)}
            </>}
          </View>
        );
      })}
    </Card>
  );
}

function DiaryCard({ entries }) {
  if (!entries?.length) return null;
  return (
    <Card title="Diary">
      {entries.map((entry, ei) => (
        <View key={entry.id} style={[styles.diaryEntry, ei > 0 && styles.diaryBorder]}>
          <Text style={styles.entryTime}>{fmtTime(entry.createdAt)}</Text>
          {config.diary.fields
            .filter((f) => entry.fields[f.id]?.length > 0)
            .map((f) => (
              <View key={f.id} style={styles.diaryField}>
                <Text style={styles.typeLabel}>{f.label}</Text>
                {entry.fields[f.id].map((item, i) => (
                  <Text key={i} style={styles.diaryItem}>· {item}</Text>
                ))}
              </View>
            ))}
        </View>
      ))}
    </Card>
  );
}

function EventsCard({ events }) {
  if (!events?.length) return null;
  return (
    <Card title="Events">
      {events.map((e) => (
        <View key={e.id} style={styles.eventRow}>
          <Text style={styles.entryTime}>{fmtTime(e.loggedAt)}</Text>
          <View style={styles.bar}>
            {Array.from({ length: 10 }, (_, i) => (
              <View key={i} style={[styles.seg, i < e.score && styles.segFilled]} />
            ))}
          </View>
          <Text style={styles.eventScore}>
            {e.score}<Text style={styles.eventDenom}>/10</Text>
          </Text>
        </View>
      ))}
    </Card>
  );
}

function RawJson({ session }) {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <TouchableOpacity onPress={() => setOpen((v) => !v)} style={styles.rawToggle}>
        <Text style={styles.rawToggleText}>{open ? 'Hide' : 'Show'} raw JSON</Text>
      </TouchableOpacity>
      {open && (
        <ScrollView horizontal style={styles.rawScroll}>
          <Text style={styles.rawText}>{JSON.stringify(session, null, 2)}</Text>
        </ScrollView>
      )}
    </View>
  );
}

// ── Session block ─────────────────────────────────────────────────────────────

function SessionBlock({ session }) {
  return (
    <View style={styles.sessionBlock}>
      <View style={styles.sessionHeader}>
        <Text style={styles.sessionTime}>{fmtSessionTime(session.startTime)}</Text>
        {session.isCurrent && <Text style={styles.currentBadge}>Current</Text>}
      </View>
      <SentimentCard value={session.sentiment} />
      <TodosCard todos={session.todos} />
      <DiaryCard entries={session.diary} />
      <EventsCard events={session.events} />
      <RawJson session={session} />
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function DataScreen({ onClose }) {
  const { sessions, isLoading, reload } = useDailyState();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Data</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={reload}>
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.doneBtn}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : sessions.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No data recorded yet.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {sessions.map((s) => <SessionBlock key={s.key} session={s} />)}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5EEE3' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#E5D9CB', backgroundColor: '#FFFDF8',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#3D2B1F' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  refreshText: { fontSize: 15, color: '#8C7B6B', fontWeight: '600' },
  doneBtn: { fontSize: 16, color: '#3D2B1F', fontWeight: '600' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 15, color: '#B5A499' },
  content: { padding: 16, gap: 24, paddingBottom: 40 },

  // Session
  sessionBlock: { gap: 10 },
  sessionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 4 },
  sessionTime: { fontSize: 13, fontWeight: '700', color: '#8C7B6B' },
  currentBadge: {
    fontSize: 10, fontWeight: '700', color: '#FFFDF8', backgroundColor: '#D4A437',
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, textTransform: 'uppercase',
  },

  // Card
  card: {
    backgroundColor: '#FFFDF8', borderRadius: 14, padding: 14, gap: 8,
    shadowColor: '#3D2B1F', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 5, elevation: 2,
  },
  cardTitle: {
    fontSize: 11, fontWeight: '700', color: '#B5A499',
    textTransform: 'uppercase', letterSpacing: 1,
  },
  empty: { fontSize: 14, color: '#C4B5A8' },

  // Sentiment
  sentimentRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sentimentScore: { fontSize: 30, fontWeight: '800', color: '#3D2B1F' },
  sentimentDenom: { fontSize: 14, color: '#B5A499', marginTop: 4 },

  // Shared bar
  bar: { flex: 1, flexDirection: 'row', gap: 3, marginLeft: 4 },
  seg: { flex: 1, height: 8, borderRadius: 4, backgroundColor: '#EDE3D7' },
  segFilled: { backgroundColor: '#D4A437' },

  // Todos
  todoMode: { gap: 2 },
  todoModeLabel: { fontSize: 13, fontWeight: '700', color: '#3D2B1F', marginTop: 4 },
  typeLabel: {
    fontSize: 10, fontWeight: '700', color: '#C4B5A8',
    textTransform: 'uppercase', letterSpacing: 0.8, marginTop: 4,
  },
  todoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 2 },
  todoCheck: { fontSize: 13, color: '#D4A437', fontWeight: '700', width: 16 },
  todoCircle: { fontSize: 13, color: '#C4B5A8', width: 16 },
  todoLabel: { fontSize: 14, color: '#3D2B1F' },
  todoLabelDone: { textDecorationLine: 'line-through', color: '#C4B5A8' },

  // Diary
  diaryEntry: { gap: 6, paddingTop: 2 },
  diaryBorder: { borderTopWidth: 1, borderTopColor: '#EDE3D7', marginTop: 6, paddingTop: 8 },
  entryTime: { fontSize: 11, color: '#B5A499', fontWeight: '600' },
  diaryField: { gap: 2 },
  diaryItem: { fontSize: 14, color: '#3D2B1F' },

  // Events
  eventRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  eventScore: { fontSize: 14, fontWeight: '700', color: '#3D2B1F', width: 36, textAlign: 'right' },
  eventDenom: { fontSize: 11, color: '#B5A499', fontWeight: '400' },

  // Raw JSON
  rawToggle: { alignItems: 'center', paddingVertical: 6 },
  rawToggleText: { fontSize: 12, color: '#B5A499', fontWeight: '600' },
  rawScroll: { backgroundColor: '#EDE3D7', borderRadius: 8, padding: 10, maxHeight: 200 },
  rawText: { fontFamily: 'monospace', fontSize: 11, color: '#8C7B6B', lineHeight: 17 },
});
