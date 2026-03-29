import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import config from '../config';

// ── Settings sheet ─────────────────────────────────────────────────────────────

function ModeGroup({ modeKey, type, definitions, onToggleSuggested, onAddCustom, onDeleteCustom }) {
  const [newLabel, setNewLabel] = useState('');

  const suggested = config.suggestedTodos.filter((s) => s.mode === modeKey && s.type === type);
  const customs   = definitions.filter((d) => !d.isSuggested && d.mode === modeKey && d.type === type);
  const isEnabled = (id) => definitions.find((d) => d.id === id)?.enabled ?? false;

  const handleAdd = () => {
    const label = newLabel.trim();
    if (!label) return;
    onAddCustom(modeKey, label, type);
    setNewLabel('');
  };

  return (
    <View style={ss.group}>
      <Text style={ss.groupLabel}>{config.modes[modeKey]}</Text>

      {suggested.map((s, i) => (
        <View key={s.id} style={[ss.row, (i < suggested.length - 1 || customs.length > 0) && ss.rowBorder]}>
          <Text style={ss.rowLabel}>{s.label}</Text>
          <Switch
            value={isEnabled(s.id)}
            onValueChange={() => onToggleSuggested(s.id)}
            trackColor={{ true: '#3D2B1F' }}
            thumbColor="#fff"
          />
        </View>
      ))}

      {customs.map((todo, i) => (
        <View key={todo.id} style={[ss.row, i < customs.length - 1 && ss.rowBorder]}>
          <Text style={ss.rowLabel}>{todo.label}</Text>
          <TouchableOpacity onPress={() => onDeleteCustom(todo.id)}>
            <Text style={ss.deleteBtn}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={ss.addForm}>
        <TextInput
          style={ss.input}
          placeholder="Add to-do…"
          placeholderTextColor="#C4B5A8"
          value={newLabel}
          onChangeText={setNewLabel}
          returnKeyType="done"
          onSubmitEditing={handleAdd}
        />
        <TouchableOpacity style={ss.addBtn} onPress={handleAdd}>
          <Text style={ss.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function TodoSettingsSheet({ visible, onClose, type, definitions, onToggleSuggested, onAddCustom, onDeleteCustom }) {
  const title = type === 'fixed' ? 'On activation' : 'Daily';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={ss.backdrop}>
          <TouchableWithoutFeedback>
            <View style={ss.sheet}>
              <View style={ss.handle} />
              <Text style={ss.title}>{title} settings</Text>
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={ss.sheetScroll} style={ss.sheetScrollView}>
                {['a', 'b'].map((m) => (
                  <ModeGroup
                    key={m}
                    modeKey={m}
                    type={type}
                    definitions={definitions}
                    onToggleSuggested={onToggleSuggested}
                    onAddCustom={onAddCustom}
                    onDeleteCustom={onDeleteCustom}
                  />
                ))}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

// ── Section ────────────────────────────────────────────────────────────────────

function TodoRow({ todo, done, onToggle, last }) {
  return (
    <TouchableOpacity
      style={[styles.row, !last && styles.rowBorder]}
      onPress={() => onToggle(todo.id)}
      activeOpacity={0.6}
    >
      <View style={[styles.checkbox, done && styles.checkboxDone]}>
        {done && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={[styles.todoLabel, done && styles.todoLabelDone]}>{todo.label}</Text>
    </TouchableOpacity>
  );
}

function Section({ title, type, todos, completions, onToggle, mode, definitions, onToggleSuggested, onAddCustom, onDeleteCustom }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  if (todos.length === 0 && !definitions) return null;

  return (
    <>
      <TodoSettingsSheet
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        type={type}
        definitions={definitions}
        onToggleSuggested={onToggleSuggested}
        onAddCustom={onAddCustom}
        onDeleteCustom={onDeleteCustom}
      />

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionLabel}>{title}</Text>
          <TouchableOpacity onPress={() => setSettingsOpen(true)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="settings-outline" size={15} color="#C4B5A8" />
          </TouchableOpacity>
        </View>

        {todos.length === 0 ? (
          <Text style={styles.sectionEmpty}>None enabled — tap ⚙ to add some.</Text>
        ) : (
          todos.map((todo, i) => (
            <TodoRow
              key={todo.id}
              todo={todo}
              done={!!completions[todo.id]}
              onToggle={onToggle}
              last={i === todos.length - 1}
            />
          ))
        )}
      </View>
    </>
  );
}

// ── TodoList ───────────────────────────────────────────────────────────────────

export default function TodoList({
  fixedTodos, fixedCompletions, onToggleFixed,
  dailyTodos, dailyCompletions, onToggleDaily,
  mode, definitions, onToggleSuggested, onAddCustom, onDeleteCustom,
}) {
  return (
    <>
      <Section
        title="On activation"
        type="fixed"
        todos={fixedTodos}
        completions={fixedCompletions}
        onToggle={onToggleFixed}
        mode={mode}
        definitions={definitions}
        onToggleSuggested={onToggleSuggested}
        onAddCustom={onAddCustom}
        onDeleteCustom={onDeleteCustom}
      />
      <Section
        title="Daily"
        type="daily"
        todos={dailyTodos}
        completions={dailyCompletions}
        onToggle={onToggleDaily}
        mode={mode}
        definitions={definitions}
        onToggleSuggested={onToggleSuggested}
        onAddCustom={onAddCustom}
        onDeleteCustom={onDeleteCustom}
      />
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFDF8',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
    shadowColor: '#3D2B1F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: '#B5A499',
    textTransform: 'uppercase', letterSpacing: 1,
  },
  sectionEmpty: { fontSize: 13, color: '#C4B5A8', paddingBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#EDE3D7' },
  checkbox: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: '#D4C4B0',
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxDone: { backgroundColor: '#D4A437', borderColor: '#D4A437' },
  checkmark:    { color: '#fff', fontSize: 12, fontWeight: '800' },
  todoLabel:     { fontSize: 15, color: '#3D2B1F', flex: 1, fontWeight: '400' },
  todoLabelDone: { textDecorationLine: 'line-through', color: '#C4B5A8' },
});

const ss = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(61,43,31,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#FFFDF8',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingTop: 16, paddingBottom: 44,
    maxHeight: '85%',
  },
  sheetScrollView: { marginTop: 12 },
  sheetScroll: { gap: 16, paddingBottom: 8 },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: '#D4C4B0', alignSelf: 'center', marginBottom: 4,
  },
  title: { fontSize: 18, fontWeight: '800', color: '#3D2B1F' },
  group: {
    backgroundColor: '#F5EEE3', borderRadius: 14,
    paddingHorizontal: 14, paddingTop: 10, paddingBottom: 4,
    gap: 0,
  },
  groupLabel: {
    fontSize: 10, fontWeight: '700', color: '#B5A499',
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6,
  },
  row: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 11,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: '#EDE3D7' },
  rowLabel: { fontSize: 15, color: '#3D2B1F', flex: 1, paddingRight: 8 },
  deleteBtn: { fontSize: 13, color: '#C0392B', fontWeight: '600' },
  empty: { fontSize: 13, color: '#C4B5A8', paddingBottom: 8 },
  addForm: { flexDirection: 'row', gap: 8, paddingTop: 10, paddingBottom: 6 },
  input: {
    flex: 1, borderWidth: 1, borderColor: '#E5D9CB', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 9, fontSize: 14, color: '#3D2B1F',
    backgroundColor: '#FFFDF8',
  },
  addBtn: {
    backgroundColor: '#3D2B1F', borderRadius: 10,
    paddingHorizontal: 16, justifyContent: 'center',
  },
  addBtnText: { color: '#FFF8F0', fontSize: 14, fontWeight: '700' },
});
