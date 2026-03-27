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

const TYPE_LABELS = { fixed: 'On activation', daily: 'Daily' };

const INTERVAL_PRESETS = [
  { label: '15m', minutes: 15 },
  { label: '30m', minutes: 30 },
  { label: '1h', minutes: 60 },
  { label: '2h', minutes: 120 },
  { label: '4h', minutes: 240 },
];

const formatInterval = (minutes) => {
  if (minutes < 60) return `${minutes}m`;
  if (minutes % 60 === 0) return `${minutes / 60}h`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
};

export default function SettingsScreen({
  definitions,
  onToggleSuggested,
  onAddCustom,
  onDeleteCustom,
  reminderDefs,
  onToggleSuggestedReminder,
  onAddCustomReminder,
  onDeleteCustomReminder,
  onClose,
}) {
  // Todo form state
  const [newLabel, setNewLabel] = useState('');
  const [newMode, setNewMode] = useState('a');
  const [newType, setNewType] = useState('daily');

  // Reminder form state
  const [reminderLabel, setReminderLabel] = useState('');
  const [reminderMode, setReminderMode] = useState('a');
  const [reminderInterval, setReminderInterval] = useState(60);

  const suggestedForMode = (mode) => config.suggestedTodos.filter((s) => s.mode === mode);
  const customTodos = definitions.filter((d) => !d.isSuggested);

  const suggestedRemindersForMode = (mode) => config.reminders.filter((r) => r.mode === mode);
  const customReminders = reminderDefs.filter((d) => !d.isSuggested);

  const isTodoEnabled = (id) => {
    const def = definitions.find((d) => d.id === id);
    return def ? def.enabled : false;
  };

  const isReminderEnabled = (id) => {
    const def = reminderDefs.find((d) => d.id === id);
    return def ? def.enabled : false;
  };

  const handleAddTodo = () => {
    const label = newLabel.trim();
    if (!label) return;
    onAddCustom(newMode, label, newType);
    setNewLabel('');
  };

  const handleAddReminder = () => {
    const label = reminderLabel.trim();
    if (!label) return;
    onAddCustomReminder(reminderMode, label, reminderInterval);
    setReminderLabel('');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.doneBtn}>Done</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>

          {/* ── To-dos ── */}
          {['a', 'b'].map((mode) => (
            <View key={mode} style={styles.section}>
              <Text style={styles.sectionTitle}>Suggested to-dos — {config.modes[mode]}</Text>
              {suggestedForMode(mode).map((s) => (
                <View key={s.id} style={styles.row}>
                  <View style={styles.rowLeft}>
                    <Text style={styles.rowLabel}>{s.label}</Text>
                    <Text style={styles.typePill}>{TYPE_LABELS[s.type]}</Text>
                  </View>
                  <Switch
                    value={isTodoEnabled(s.id)}
                    onValueChange={() => onToggleSuggested(s.id)}
                    trackColor={{ true: '#000' }}
                    thumbColor="#fff"
                  />
                </View>
              ))}
            </View>
          ))}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Custom to-dos</Text>
            {customTodos.length === 0 && <Text style={styles.emptyText}>No custom to-dos yet.</Text>}
            {customTodos.map((todo) => (
              <View key={todo.id} style={styles.row}>
                <View style={styles.rowLeft}>
                  <Text style={styles.rowLabel}>{todo.label}</Text>
                  <Text style={styles.modePill}>{config.modes[todo.mode]}</Text>
                  <Text style={styles.typePill}>{TYPE_LABELS[todo.type] ?? 'Daily'}</Text>
                </View>
                <TouchableOpacity onPress={() => onDeleteCustom(todo.id)}>
                  <Text style={styles.deleteBtn}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}
            <View style={styles.addForm}>
              <TextInput
                style={styles.input}
                placeholder="New to-do label"
                placeholderTextColor="#bbb"
                value={newLabel}
                onChangeText={setNewLabel}
                returnKeyType="done"
                onSubmitEditing={handleAddTodo}
              />
              <Text style={styles.pickerLabel}>Mode</Text>
              <View style={styles.selector}>
                {['a', 'b'].map((m) => (
                  <TouchableOpacity
                    key={m}
                    style={[styles.selectorBtn, newMode === m && styles.selectorBtnActive]}
                    onPress={() => setNewMode(m)}
                  >
                    <Text style={[styles.selectorBtnText, newMode === m && styles.selectorBtnTextActive]}>
                      {config.modes[m]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.pickerLabel}>Type</Text>
              <View style={styles.selector}>
                {['daily', 'fixed'].map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.selectorBtn, newType === t && styles.selectorBtnActive]}
                    onPress={() => setNewType(t)}
                  >
                    <Text style={[styles.selectorBtnText, newType === t && styles.selectorBtnTextActive]}>
                      {TYPE_LABELS[t]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.addBtn} onPress={handleAddTodo}>
                <Text style={styles.addBtnText}>Add to-do</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Reminders ── */}
          {['a', 'b'].map((mode) => (
            <View key={`r-${mode}`} style={styles.section}>
              <Text style={styles.sectionTitle}>Suggested reminders — {config.modes[mode]}</Text>
              {suggestedRemindersForMode(mode).map((r) => (
                <View key={r.id} style={styles.row}>
                  <View style={styles.rowLeft}>
                    <Text style={styles.rowLabel}>{r.label}</Text>
                    <Text style={styles.intervalPill}>Every {formatInterval(r.intervalMinutes)}</Text>
                  </View>
                  <Switch
                    value={isReminderEnabled(r.id)}
                    onValueChange={() => onToggleSuggestedReminder(r.id)}
                    trackColor={{ true: '#000' }}
                    thumbColor="#fff"
                  />
                </View>
              ))}
            </View>
          ))}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Custom reminders</Text>
            {customReminders.length === 0 && <Text style={styles.emptyText}>No custom reminders yet.</Text>}
            {customReminders.map((r) => (
              <View key={r.id} style={styles.row}>
                <View style={styles.rowLeft}>
                  <Text style={styles.rowLabel}>{r.label}</Text>
                  <Text style={styles.modePill}>{config.modes[r.mode]}</Text>
                  <Text style={styles.intervalPill}>Every {formatInterval(r.intervalMinutes)}</Text>
                </View>
                <TouchableOpacity onPress={() => onDeleteCustomReminder(r.id)}>
                  <Text style={styles.deleteBtn}>Delete</Text>
                </TouchableOpacity>
              </View>
            ))}
            <View style={styles.addForm}>
              <TextInput
                style={styles.input}
                placeholder="Reminder label"
                placeholderTextColor="#bbb"
                value={reminderLabel}
                onChangeText={setReminderLabel}
                returnKeyType="done"
                onSubmitEditing={handleAddReminder}
              />
              <Text style={styles.pickerLabel}>Mode</Text>
              <View style={styles.selector}>
                {['a', 'b'].map((m) => (
                  <TouchableOpacity
                    key={m}
                    style={[styles.selectorBtn, reminderMode === m && styles.selectorBtnActive]}
                    onPress={() => setReminderMode(m)}
                  >
                    <Text style={[styles.selectorBtnText, reminderMode === m && styles.selectorBtnTextActive]}>
                      {config.modes[m]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.pickerLabel}>Interval</Text>
              <View style={styles.selector}>
                {INTERVAL_PRESETS.map((p) => (
                  <TouchableOpacity
                    key={p.minutes}
                    style={[styles.selectorBtn, reminderInterval === p.minutes && styles.selectorBtnActive]}
                    onPress={() => setReminderInterval(p.minutes)}
                  >
                    <Text style={[styles.selectorBtnText, reminderInterval === p.minutes && styles.selectorBtnTextActive]}>
                      {p.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.addBtn} onPress={handleAddReminder}>
                <Text style={styles.addBtnText}>Add reminder</Text>
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
  rowLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  rowLabel: { fontSize: 15, color: '#111' },
  modePill: {
    fontSize: 11, fontWeight: '600', color: '#888',
    backgroundColor: '#f0f0f0', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
  },
  typePill: {
    fontSize: 11, fontWeight: '600', color: '#555',
    backgroundColor: '#e8e8e8', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
  },
  intervalPill: {
    fontSize: 11, fontWeight: '600', color: '#555',
    backgroundColor: '#e8e8e8', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4,
  },
  deleteBtn: { fontSize: 14, color: '#e00', fontWeight: '600', paddingLeft: 12 },
  emptyText: { fontSize: 14, color: '#bbb' },
  addForm: { gap: 10, paddingTop: 4 },
  input: {
    borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, color: '#111',
  },
  pickerLabel: { fontSize: 12, color: '#aaa', fontWeight: '600', marginBottom: -4 },
  selector: { flexDirection: 'row', gap: 6 },
  selectorBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 8,
    borderWidth: 1, borderColor: '#ddd', alignItems: 'center',
  },
  selectorBtnActive: { backgroundColor: '#000', borderColor: '#000' },
  selectorBtnText: { fontSize: 13, color: '#555', fontWeight: '600' },
  selectorBtnTextActive: { color: '#fff' },
  addBtn: {
    backgroundColor: '#000', borderRadius: 8, paddingVertical: 12, alignItems: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
