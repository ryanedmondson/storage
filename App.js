import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DiaryEntryForm from './components/DiaryEntryForm';
import DiarySection from './components/DiarySection';
import EventLogModal from './components/EventLogModal';
import InsightsScreen from './components/InsightsScreen';
import ModeToggle from './components/ModeToggle';
import SettingsScreen from './components/SettingsScreen';
import SentimentTracker from './components/SentimentTracker';
import TodoList from './components/TodoList';
import config from './config';
import useDiary from './hooks/useDiary';
import useEventLog from './hooks/useEventLog';
import useMode from './hooks/useMode';
import useReminders from './hooks/useReminders';
import useSentiment from './hooks/useSentiment';
import useTodos from './hooks/useTodos';

// ── Tab bar ────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'todos',    label: 'To-dos',   icon: 'list',      outline: 'list-outline'      },
  { id: 'insights', label: 'Insights', icon: 'bar-chart', outline: 'bar-chart-outline' },
  { id: 'settings', label: 'Settings', icon: 'settings',  outline: 'settings-outline'  },
];

function TabBar({ active, onChange }) {
  return (
    <View style={tabStyles.bar}>
      {TABS.map((t) => {
        const on = active === t.id;
        return (
          <TouchableOpacity
            key={t.id}
            style={tabStyles.tab}
            onPress={() => onChange(t.id)}
            activeOpacity={0.7}
          >
            <Ionicons name={on ? t.icon : t.outline} size={22} color={on ? '#1A1A1A' : '#B0B0B0'} />
            <Text style={[tabStyles.label, on && tabStyles.labelActive]}>{t.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#EBEBEB',
    paddingTop: 10,
    paddingBottom: 10,
  },
  tab:         { flex: 1, alignItems: 'center', gap: 3, paddingVertical: 2 },
  label:       { fontSize: 10, fontWeight: '500', color: '#B0B0B0', letterSpacing: 0.2 },
  labelActive: { color: '#1A1A1A', fontWeight: '700' },
});

// ── App ────────────────────────────────────────────────────────────────────────

export default function App() {
  const { mode, updateMode, isLoaded: modeLoaded } = useMode();
  const [tab, setTab] = useState('todos');
  const [showDiaryForm, setShowDiaryForm] = useState(false);
  const [logModalVisible, setLogModalVisible] = useState(false);

  const { logEvent } = useEventLog();
  const {
    isLoaded, definitions, completions, fixedCompletions,
    todosForMode, toggleCompletion, toggleFixedCompletion,
    activateMode, toggleSuggested, addCustomTodo, deleteCustomTodo,
  } = useTodos();

  const { level, selectLevel } = useSentiment();
  const { entries, addEntry, deleteEntry } = useDiary();
  const {
    reminderDefs, dueRemindersForMode, completeReminder,
    toggleSuggestedReminder, addCustomReminder, deleteCustomReminder,
  } = useReminders();

  const reminderIds = new Set(reminderDefs.map((r) => r.id));
  const handleToggleFixed = (id) => {
    if (reminderIds.has(id)) completeReminder(id);
    else toggleFixedCompletion(mode, id);
  };

  const handleToggleMode = () => {
    const next = mode === 'a' ? 'b' : 'a';
    activateMode(next);
    updateMode(next);
  };

  if (!isLoaded || !modeLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1A1A1A" />
      </View>
    );
  }

  if (showDiaryForm) {
    return (
      <DiaryEntryForm
        onSubmit={(fields) => { addEntry(fields); setShowDiaryForm(false); }}
        onCancel={() => setShowDiaryForm(false)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.body}>

        {/* ── To-dos tab ── */}
        {tab === 'todos' && (
          <View style={styles.fill}>
            <ScrollView
              contentContainerStyle={styles.todosScroll}
              showsVerticalScrollIndicator={false}
            >
              {/* Header row */}
              <View style={styles.todosHeader}>
                <Text style={styles.pageTitle}>Today</Text>
                <ModeToggle mode={mode} onToggle={handleToggleMode} />
              </View>

              <SentimentTracker level={level} onSelect={selectLevel} />

              <View style={styles.sections}>
                <TodoList
                  fixedTodos={[...todosForMode(mode, 'fixed'), ...dueRemindersForMode(mode)]}
                  fixedCompletions={fixedCompletions[mode]}
                  onToggleFixed={handleToggleFixed}
                  dailyTodos={todosForMode(mode, 'daily')}
                  dailyCompletions={completions}
                  onToggleDaily={toggleCompletion}
                />
                <DiarySection
                  entries={entries}
                  onAdd={() => setShowDiaryForm(true)}
                  onDelete={deleteEntry}
                />
              </View>
            </ScrollView>

            {/* Primary action button */}
            <TouchableOpacity
              style={styles.fab}
              onPress={() => setLogModalVisible(true)}
              activeOpacity={0.88}
            >
              <Text style={styles.fabText}>{config.eventLog.buttonLabel}</Text>
            </TouchableOpacity>
          </View>
        )}

        {tab === 'insights' && <InsightsScreen />}

        {tab === 'settings' && (
          <SettingsScreen
            definitions={definitions}
            onToggleSuggested={toggleSuggested}
            onAddCustom={addCustomTodo}
            onDeleteCustom={deleteCustomTodo}
            reminderDefs={reminderDefs}
            onToggleSuggestedReminder={toggleSuggestedReminder}
            onAddCustomReminder={addCustomReminder}
            onDeleteCustomReminder={deleteCustomReminder}
          />
        )}
      </View>

      <TabBar active={tab} onChange={setTab} />

      <EventLogModal
        visible={logModalVisible}
        onSave={(score) => { logEvent(score); setLogModalVisible(false); }}
        onClose={() => setLogModalVisible(false)}
      />

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' },
  safe:    { flex: 1, backgroundColor: '#F5F5F5' },
  body:    { flex: 1 },
  fill:    { flex: 1 },

  // Todos tab
  todosScroll: { paddingBottom: 96 },
  todosHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 24, paddingBottom: 12,
  },
  pageTitle: { fontSize: 30, fontWeight: '800', color: '#1A1A1A', letterSpacing: -0.5 },
  sections:  { gap: 12, paddingHorizontal: 16, paddingTop: 4 },

  // FAB
  fab: {
    position: 'absolute', bottom: 16, left: 16, right: 16,
    backgroundColor: '#1A1A1A', borderRadius: 14,
    paddingVertical: 17, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18, shadowRadius: 12, elevation: 6,
  },
  fabText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
});
