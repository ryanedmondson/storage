import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import config from '../config';

export default function SettingsScreen({
  definitions,
  onToggleSuggested,
  onAddCustom,
  onDeleteCustom,
  onClose,
}) {
  const [newLabel, setNewLabel] = useState('');
  const [newMode, setNewMode] = useState('a');

  const suggestedForMode = (mode) =>
    config.suggestedTodos.filter((s) => s.mode === mode);

  const customTodos = definitions.filter((d) => !d.isSuggested);

  const isEnabled = (id) => {
    const def = definitions.find((d) => d.id === id);
    return def ? def.enabled : false;
  };

  const handleAdd = () => {
    const label = newLabel.trim();
    if (!label) return;
    onAddCustom(newMode, label);
    setNewLabel('');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.doneBtn}>Done</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          {/* Suggested todos per mode */}
          {['a', 'b'].map((mode) => (
            <View key={mode} style={styles.section}>
              <Text style={styles.sectionTitle}>
                Suggested — {config.modes[mode]}
              </Text>
              {suggestedForMode(mode).map((s) => (
                <View key={s.id} style={styles.row}>
                  <Text style={styles.rowLabel}>{s.label}</Text>
                  <Switch
                    value={isEnabled(s.id)}
                    onValueChange={() => onToggleSuggested(s.id)}
                    trackColor={{ true: '#000' }}
                    thumbColor="#fff"
                  />
                </View>
              ))}
            </View>
          ))}

          {/* Custom todos */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Custom to-dos</Text>

            {customTodos.length === 0 && (
              <Text style={styles.emptyText}>No custom to-dos yet.</Text>
            )}

            {customTodos.map((todo) => (
              <View key={todo.id} style={styles.row}>
                <View style={styles.customMeta}>
                  <Text style={styles.rowLabel}>{todo.label}</Text>
                  <Text style={styles.modePill}>{config.modes[todo.mode]}</Text>
                </View>
                <TouchableOpacity onPress={() => onDeleteCustom(todo.id)}>
                  <Text style={styles.deleteBtn}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}

            {/* Add custom form */}
            <View style={styles.addForm}>
              <TextInput
                style={styles.input}
                placeholder="New to-do label"
                placeholderTextColor="#bbb"
                value={newLabel}
                onChangeText={setNewLabel}
                returnKeyType="done"
                onSubmitEditing={handleAdd}
              />
              <View style={styles.modeSelector}>
                {['a', 'b'].map((m) => (
                  <TouchableOpacity
                    key={m}
                    style={[styles.modeBtn, newMode === m && styles.modeBtnActive]}
                    onPress={() => setNewMode(m)}
                  >
                    <Text style={[styles.modeBtnText, newMode === m && styles.modeBtnTextActive]}>
                      {config.modes[m]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                <Text style={styles.addBtnText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  doneBtn: { fontSize: 16, color: '#000', fontWeight: '600' },
  scroll: { flex: 1 },
  content: { padding: 20, gap: 24, paddingBottom: 40 },
  section: { gap: 12 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  rowLabel: { fontSize: 15, color: '#111', flex: 1 },
  customMeta: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  modePill: {
    fontSize: 11,
    fontWeight: '600',
    color: '#888',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  deleteBtn: { fontSize: 14, color: '#e00', fontWeight: '600' },
  emptyText: { fontSize: 14, color: '#bbb' },
  addForm: { gap: 10, paddingTop: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111',
  },
  modeSelector: { flexDirection: 'row', gap: 8 },
  modeBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  modeBtnActive: { backgroundColor: '#000', borderColor: '#000' },
  modeBtnText: { fontSize: 14, color: '#555', fontWeight: '600' },
  modeBtnTextActive: { color: '#fff' },
  addBtn: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
