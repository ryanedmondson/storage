import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import config from '../config';

function EntryCard({ entry, onDelete, showBorder }) {
  const time = new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const populatedFields = config.diary.fields.filter((f) => entry.fields[f.id]?.length > 0);

  return (
    <View style={[styles.entry, showBorder && styles.entryBorder]}>
      <View style={styles.entryHeader}>
        <Text style={styles.entryTime}>{time}</Text>
        <TouchableOpacity onPress={() => onDelete(entry.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
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
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.sectionLabel}>Diary</Text>
          <TouchableOpacity onPress={onAdd} style={styles.addInline}>
            <Text style={styles.addInlineText}>+ {config.diary.addButtonLabel}</Text>
          </TouchableOpacity>
        </View>
        {entries.length === 0 ? (
          <Text style={styles.emptyText}>No entries yet.</Text>
        ) : (
          entries.map((entry, i) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              onDelete={onDelete}
              showBorder={i > 0}
            />
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { paddingBottom: 8 },
  card: {
    backgroundColor: '#FFFDF8',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 14,
    shadowColor: '#3D2B1F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 11, fontWeight: '700', color: '#B5A499',
    textTransform: 'uppercase', letterSpacing: 1,
  },
  addInline: { paddingVertical: 2 },
  addInlineText: { fontSize: 13, color: '#8C7B6B', fontWeight: '600' },
  emptyText: { fontSize: 14, color: '#C4B5A8', paddingBottom: 4 },
  entry:       { paddingVertical: 10, gap: 6 },
  entryBorder: { borderTopWidth: 1, borderTopColor: '#EDE3D7' },
  entryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  entryTime:   { fontSize: 12, color: '#B5A499', fontWeight: '600' },
  deleteBtn:   { fontSize: 12, color: '#C0392B', fontWeight: '600' },
  fieldBlock:  { gap: 2 },
  fieldLabel:  { fontSize: 10, fontWeight: '700', color: '#C4B5A8', textTransform: 'uppercase', letterSpacing: 0.8 },
  fieldItem:   { fontSize: 14, color: '#3D2B1F', lineHeight: 20 },
});
