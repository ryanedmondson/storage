import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
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
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.titleRow}>
        <Text style={styles.pageTitle}>Settings</Text>
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
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F5EEE3' },
  titleRow: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8 },
  pageTitle: { fontSize: 30, fontWeight: '800', color: '#3D2B1F', letterSpacing: -0.5 },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 20, paddingBottom: 40 },

  section: {
    backgroundColor: '#FFFDF8', borderRadius: 16, gap: 0,
    shadowColor: '#3D2B1F', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 11, fontWeight: '700', color: '#B5A499',
    textTransform: 'uppercase', letterSpacing: 1,
    paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8,
  },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: '#EDE3D7',
  },
  rowLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap', paddingRight: 8 },
  rowLabel: { fontSize: 15, color: '#3D2B1F', fontWeight: '400' },
  modePill: {
    fontSize: 11, fontWeight: '600', color: '#8C7B6B',
    backgroundColor: '#EDE3D7', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6,
  },
  typePill: {
    fontSize: 11, fontWeight: '600', color: '#8C7B6B',
    backgroundColor: '#EDE3D7', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6,
  },
  intervalPill: {
    fontSize: 11, fontWeight: '600', color: '#8C7B6B',
    backgroundColor: '#EDE3D7', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6,
  },
  deleteBtn: { fontSize: 13, color: '#C0392B', fontWeight: '600' },
  emptyText: { fontSize: 14, color: '#C4B5A8', paddingHorizontal: 16, paddingBottom: 14 },
  addForm: { gap: 10, padding: 16, borderTopWidth: 1, borderTopColor: '#EDE3D7' },
  input: {
    borderWidth: 1, borderColor: '#E5D9CB', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 11, fontSize: 15, color: '#3D2B1F',
    backgroundColor: '#FFF8F2',
  },
  pickerLabel: { fontSize: 12, color: '#B5A499', fontWeight: '600', marginBottom: -4 },
  selector: { flexDirection: 'row', gap: 8 },
  selectorBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#E5D9CB', alignItems: 'center', backgroundColor: '#FFF8F2',
  },
  selectorBtnActive:     { backgroundColor: '#3D2B1F', borderColor: '#3D2B1F' },
  selectorBtnText:       { fontSize: 13, color: '#8C7B6B', fontWeight: '600' },
  selectorBtnTextActive: { color: '#FFF8F0' },
  addBtn: {
    backgroundColor: '#3D2B1F', borderRadius: 12, paddingVertical: 13, alignItems: 'center',
  },
  addBtnText: { color: '#FFF8F0', fontSize: 15, fontWeight: '700' },
});
