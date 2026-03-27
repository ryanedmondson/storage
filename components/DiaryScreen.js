import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import config from '../config';

function EntryCard({ entry, onDelete }) {
  const time = new Date(entry.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const populatedFields = config.diary.fields.filter(
    (f) => entry.fields[f.id]?.length > 0
  );

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTime}>{time}</Text>
        <TouchableOpacity onPress={() => onDelete(entry.id)}>
          <Text style={styles.deleteBtn}>Delete</Text>
        </TouchableOpacity>
      </View>

      {populatedFields.map((field) => (
        <View key={field.id} style={styles.fieldBlock}>
          <Text style={styles.fieldLabel}>{field.label}</Text>
          {entry.fields[field.id].map((item, i) => (
            <Text key={i} style={styles.fieldItem}>· {item}</Text>
          ))}
        </View>
      ))}
    </View>
  );
}

export default function DiaryScreen({ entries, onAdd, onDelete, onClose }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Diary</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.doneBtn}>Done</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {entries.length === 0 && (
          <Text style={styles.emptyText}>No entries today yet.</Text>
        )}
        {entries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} onDelete={onDelete} />
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
          <Text style={styles.addBtnText}>{config.diary.addButtonLabel}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
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
  content: { padding: 20, gap: 16, paddingBottom: 40 },
  emptyText: { fontSize: 15, color: '#bbb', textAlign: 'center', marginTop: 24 },
  card: {
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 10,
    padding: 14,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTime: { fontSize: 12, color: '#aaa', fontWeight: '600' },
  deleteBtn: { fontSize: 13, color: '#e00', fontWeight: '600' },
  fieldBlock: { gap: 4 },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  fieldItem: { fontSize: 14, color: '#333', lineHeight: 20 },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  addBtn: {
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
