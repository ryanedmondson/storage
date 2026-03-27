import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TodoList({ todos, completions, onToggle }) {
  if (todos.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No to-dos for this mode yet.</Text>
        <Text style={styles.emptyHint}>Add some in Settings.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.list}>
      {todos.map((todo) => {
        const done = !!completions[todo.id];
        return (
          <TouchableOpacity key={todo.id} style={styles.row} onPress={() => onToggle(todo.id)}>
            <View style={[styles.checkbox, done && styles.checkboxDone]}>
              {done && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={[styles.todoLabel, done && styles.todoLabelDone]}>{todo.label}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    width: '100%',
  },
  list: {
    paddingHorizontal: 24,
    paddingTop: 8,
    gap: 12,
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
  checkboxDone: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  todoLabel: {
    fontSize: 16,
    color: '#111',
    flex: 1,
  },
  todoLabelDone: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 16,
    gap: 4,
  },
  emptyText: {
    fontSize: 15,
    color: '#888',
  },
  emptyHint: {
    fontSize: 13,
    color: '#bbb',
  },
});
