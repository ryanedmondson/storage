import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ModeToggle from './components/ModeToggle';
import SentimentTracker from './components/SentimentTracker';
import SettingsScreen from './components/SettingsScreen';
import TodoList from './components/TodoList';
import DiarySection from './components/DiarySection';
import DiaryEntryForm from './components/DiaryEntryForm';
import useSentiment from './hooks/useSentiment';
import useTodos from './hooks/useTodos';
import useDiary from './hooks/useDiary';

export default function App() {
  const [mode, setMode] = useState('a');
  const [screen, setScreen] = useState('main');
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

  const handleToggleMode = () => {
    const next = mode === 'a' ? 'b' : 'a';
    activateMode(next);
    setMode(next);
  };

  if (!isLoaded) {
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

  if (screen === 'settings') {
    return (
      <SettingsScreen
        definitions={definitions}
        onToggleSuggested={toggleSuggested}
        onAddCustom={addCustomTodo}
        onDeleteCustom={deleteCustomTodo}
        onClose={() => setScreen('main')}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
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
          fixedTodos={todosForMode(mode, 'fixed')}
          fixedCompletions={fixedCompletions[mode]}
          onToggleFixed={(id) => toggleFixedCompletion(mode, id)}
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
    alignItems: 'flex-end',
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
    paddingBottom: 40,
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
