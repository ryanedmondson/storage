import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

function TodoRow({ todo, done, onToggle }) {
  return (
    <TouchableOpacity style={styles.row} onPress={() => onToggle(todo.id)}>
      <View style={[styles.checkbox, done && styles.checkboxDone]}>
        {done && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={[styles.todoLabel, done && styles.todoLabelDone]}>{todo.label}</Text>
    </TouchableOpacity>
  );
}

function Section({ title, todos, completions, onToggle }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {todos.length === 0 ? (
        <Text style={styles.emptyText}>None added yet — configure in Settings.</Text>
      ) : (
        todos.map((todo) => (
          <TodoRow
            key={todo.id}
            todo={todo}
            done={!!completions[todo.id]}
            onToggle={onToggle}
          />
        ))
      )}
    </View>
  );
}

export default function TodoList({
  fixedTodos,
  fixedCompletions,
  onToggleFixed,
  dailyTodos,
  dailyCompletions,
  onToggleDaily,
}) {
  const hasAnything = fixedTodos.length > 0 || dailyTodos.length > 0;

  if (!hasAnything) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyMain}>No to-dos for this mode yet.</Text>
        <Text style={styles.emptyHint}>Add some in Settings.</Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      <Section
        title="On activation"
        todos={fixedTodos}
        completions={fixedCompletions}
        onToggle={onToggleFixed}
      />
      <Section
        title="Daily"
        todos={dailyTodos}
        completions={dailyCompletions}
        onToggle={onToggleDaily}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 24, paddingTop: 4, gap: 24 },
  section: { gap: 4 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: { backgroundColor: '#000', borderColor: '#000' },
  checkmark: { color: '#fff', fontSize: 14, fontWeight: '700' },
  todoLabel: { fontSize: 16, color: '#111', flex: 1 },
  todoLabelDone: { textDecorationLine: 'line-through', color: '#aaa' },
  empty: { alignItems: 'center', paddingTop: 16, gap: 4 },
  emptyMain: { fontSize: 15, color: '#888' },
  emptyHint: { fontSize: 13, color: '#bbb' },
  emptyText: { fontSize: 14, color: '#ccc', paddingVertical: 6 },
});
