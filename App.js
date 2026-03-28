import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ModeToggle from './components/ModeToggle';
import SentimentTracker from './components/SentimentTracker';
import SettingsScreen from './components/SettingsScreen';
import TodoList from './components/TodoList';
import DiarySection from './components/DiarySection';
import DiaryEntryForm from './components/DiaryEntryForm';
import EventLogModal from './components/EventLogModal';
import DataScreen from './components/DataScreen';
import useSentiment from './hooks/useSentiment';
import useTodos from './hooks/useTodos';
import useDiary from './hooks/useDiary';
import useReminders from './hooks/useReminders';
import useMode from './hooks/useMode';
import useEventLog from './hooks/useEventLog';
import config from './config';

export default function App() {
  const { mode, updateMode, isLoaded: modeLoaded } = useMode();
  const [screen, setScreen] = useState('main');
  const [logModalVisible, setLogModalVisible] = useState(false);
  const { logEvent } = useEventLog();
  const {
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
  } = useTodos();

  const { level, selectLevel } = useSentiment();
  const { entries, addEntry, deleteEntry } = useDiary();
  const {
    reminderDefs,
    dueRemindersForMode,
    completeReminder,
    toggleSuggestedReminder,
    addCustomReminder,
    deleteCustomReminder,
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
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (screen === 'diary-form') {
    return (
      <DiaryEntryForm
        onSubmit={(fields) => { addEntry(fields); setScreen('main'); }}
        onCancel={() => setScreen('main')}
      />
    );
  }

  if (screen === 'data') {
    return <DataScreen onClose={() => setScreen('main')} />;
  }

  if (screen === 'settings') {
    return (
      <SettingsScreen
        definitions={definitions}
        onToggleSuggested={toggleSuggested}
        onAddCustom={addCustomTodo}
        onDeleteCustom={deleteCustomTodo}
        reminderDefs={reminderDefs}
        onToggleSuggestedReminder={toggleSuggestedReminder}
        onAddCustomReminder={addCustomReminder}
        onDeleteCustomReminder={deleteCustomReminder}
        onClose={() => setScreen('main')}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => setScreen('data')}>
          <Text style={styles.topBarBtn}>Data</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setScreen('settings')}>
          <Text style={styles.topBarBtn}>Settings</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.toggleSection}>
          <ModeToggle mode={mode} onToggle={handleToggleMode} />
        </View>

        <SentimentTracker level={level} onSelect={selectLevel} />

        <View style={styles.divider} />

        <TodoList
          fixedTodos={[...todosForMode(mode, 'fixed'), ...dueRemindersForMode(mode)]}
          fixedCompletions={fixedCompletions[mode]}
          onToggleFixed={handleToggleFixed}
          dailyTodos={todosForMode(mode, 'daily')}
          dailyCompletions={completions}
          onToggleDaily={toggleCompletion}
        />

        <View style={styles.divider} />

        <DiarySection
          entries={entries}
          onAdd={() => setScreen('diary-form')}
          onDelete={deleteEntry}
        />
      </ScrollView>

      <View style={styles.fixedFooter}>
        <TouchableOpacity style={styles.logBtn} onPress={() => setLogModalVisible(true)}>
          <Text style={styles.logBtnText}>{config.eventLog.buttonLabel}</Text>
        </TouchableOpacity>
      </View>

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
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  topBarBtn: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  scroll: {
    paddingBottom: 100,
  },
  fixedFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  logBtn: {
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  toggleSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 24,
    marginVertical: 16,
  },
});
