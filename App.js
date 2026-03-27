import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ModeToggle from './components/ModeToggle';
import SettingsScreen from './components/SettingsScreen';
import TodoList from './components/TodoList';
import useTodos from './hooks/useTodos';

export default function App() {
  const [mode, setMode] = useState('a');
  const [screen, setScreen] = useState('main');
  const {
    isLoaded,
    definitions,
    completions,
    todosForMode,
    toggleCompletion,
    toggleSuggested,
    addCustomTodo,
    deleteCustomTodo,
  } = useTodos();

  if (!isLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#000" />
      </View>
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
          <Text style={styles.settingsBtn}>Settings</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.toggleSection}>
        <ModeToggle mode={mode} onToggle={() => setMode((m) => (m === 'a' ? 'b' : 'a'))} />
      </View>

      <View style={styles.divider} />

      <TodoList
        todos={todosForMode(mode)}
        completions={completions}
        onToggle={toggleCompletion}
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
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  settingsBtn: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
  },
  toggleSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 24,
    marginBottom: 16,
  },
});
