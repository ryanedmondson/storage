import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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

export default function DiarySection({ entries, onAdd, onDelete }) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Diary</Text>

      {entries.length === 0 ? (
        <Text style={styles.emptyText}>No entries today yet.</Text>
      ) : (
        entries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} onDelete={onDelete} />
        ))
      )}

      <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
        <Text style={styles.addBtnText}>{config.diary.addButtonLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 32,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  emptyText: { fontSize: 14, color: '#ccc' },
  card: {
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 10,
    padding: 12,
    gap: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTime: { fontSize: 12, color: '#aaa', fontWeight: '600' },
  deleteBtn: { fontSize: 13, color: '#e00', fontWeight: '600' },
  fieldBlock: { gap: 2 },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  fieldItem: { fontSize: 14, color: '#333', lineHeight: 20 },
  addBtn: {
    borderWidth: 1.5,
    borderColor: '#000',
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 4,
  },
  addBtnText: { color: '#000', fontSize: 15, fontWeight: '600' },
});
