import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

function Section({ title, todos, completions, onToggle }) {
  if (todos.length === 0) return null;
  return (
    <View style={styles.card}>
      <Text style={styles.sectionLabel}>{title}</Text>
      {todos.map((todo, i) => (
        <TodoRow
          key={todo.id}
          todo={todo}
          done={!!completions[todo.id]}
          onToggle={onToggle}
          last={i === todos.length - 1}
        />
      ))}
    </View>
  );
}

export default function TodoList({
  fixedTodos, fixedCompletions, onToggleFixed,
  dailyTodos, dailyCompletions, onToggleDaily,
}) {
  if (!fixedTodos.length && !dailyTodos.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyMain}>No to-dos for this mode.</Text>
        <Text style={styles.emptyHint}>Configure them in Settings.</Text>
      </View>
    );
  }

  return (
    <>
      <Section title="On activation" todos={fixedTodos} completions={fixedCompletions} onToggle={onToggleFixed} />
      <Section title="Daily" todos={dailyTodos} completions={dailyCompletions} onToggle={onToggleDaily} />
    </>
  );
}

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
  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: '#B5A499',
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8,
  },
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
  empty:         { alignItems: 'center', paddingVertical: 24, gap: 4 },
  emptyMain:     { fontSize: 15, color: '#8C7B6B' },
  emptyHint:     { fontSize: 13, color: '#C4B5A8' },
});
