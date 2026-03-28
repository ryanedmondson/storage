import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import config from '../config';

export default function ModeToggle({ mode, onToggle }) {
  return (
    <TouchableOpacity style={styles.pill} onPress={onToggle} activeOpacity={0.7}>
      <View style={styles.dot} />
      <Text style={styles.label}>{config.modes[mode]}</Text>
      <Text style={styles.arrow}>⇄</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: '#EFEFEF',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#1A1A1A',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  arrow: {
    fontSize: 13,
    color: '#999',
  },
});
