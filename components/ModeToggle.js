import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import config from '../config';

export default function ModeToggle() {
  const [mode, setMode] = useState('a');

  const toggle = () => setMode((m) => (m === 'a' ? 'b' : 'a'));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Current mode</Text>
      <Text style={styles.mode}>{config.modes[mode]}</Text>
      <TouchableOpacity style={styles.button} onPress={toggle}>
        <Text style={styles.buttonText}>{config.buttonLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 16,
  },
  label: {
    fontSize: 14,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  mode: {
    fontSize: 36,
    fontWeight: '700',
  },
  button: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    backgroundColor: '#000',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
