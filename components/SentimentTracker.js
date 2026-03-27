import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import config from '../config';

const LEVELS = [1, 2, 3, 4, 5];

export default function SentimentTracker({ level, onSelect }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{config.sentiment.label}</Text>
      <View style={styles.levels}>
        {LEVELS.map((l) => {
          const selected = l === level;
          return (
            <TouchableOpacity
              key={l}
              style={[styles.btn, selected && styles.btnSelected]}
              onPress={() => onSelect(l)}
            >
              <Text style={[styles.btnText, selected && styles.btnTextSelected]}>{l}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  levels: {
    flexDirection: 'row',
    gap: 8,
  },
  btn: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ccc',
  },
  btnTextSelected: {
    color: '#fff',
  },
});
