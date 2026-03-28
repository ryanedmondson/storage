import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import config from '../config';

const LEVELS = [1, 2, 3, 4, 5];

export default function SentimentTracker({ level, onSelect }) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionLabel}>{config.sentiment.label}</Text>
      <View style={styles.row}>
        {LEVELS.map((l) => {
          const selected = l === level;
          return (
            <TouchableOpacity
              key={l}
              style={[styles.btn, selected && styles.btnSelected]}
              onPress={() => onSelect(l)}
              activeOpacity={0.7}
            >
              <Text style={[styles.num, selected && styles.numSelected]}>{l}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    backgroundColor: '#FFFDF8',
    borderRadius: 16,
    padding: 16,
    gap: 14,
    shadowColor: '#3D2B1F',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B5A499',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  row:         { flexDirection: 'row', gap: 8 },
  btn:         { flex: 1, aspectRatio: 1, borderRadius: 12, backgroundColor: '#EDE3D7', alignItems: 'center', justifyContent: 'center' },
  btnSelected: { backgroundColor: '#D4A437' },
  num:         { fontSize: 17, fontWeight: '700', color: '#C4B5A8' },
  numSelected: { color: '#fff' },
});
