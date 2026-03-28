import { useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import config from '../config';

const SCORES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function EventLogModal({ visible, onSave, onClose }) {
  const [selected, setSelected] = useState(null);

  const handleSave = () => {
    if (selected === null) return;
    onSave(selected);
    setSelected(null);
  };

  const handleClose = () => {
    setSelected(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <View style={styles.handle} />
              <Text style={styles.title}>{config.eventLog.buttonLabel}</Text>
              <Text style={styles.scoreLabel}>{config.eventLog.scoreLabel}</Text>

              <View style={styles.grid}>
                {SCORES.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.scoreBtn, selected === s && styles.scoreBtnSelected]}
                    onPress={() => setSelected(s)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.scoreBtnText, selected === s && styles.scoreBtnTextSelected]}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={[styles.saveBtn, selected === null && styles.saveBtnDisabled]}
                onPress={handleSave}
                disabled={selected === null}
                activeOpacity={0.88}
              >
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(61,43,31,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#FFFDF8',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 44, gap: 18,
    alignItems: 'stretch',
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: '#D4C4B0', alignSelf: 'center', marginBottom: 4,
  },
  title: { fontSize: 20, fontWeight: '800', color: '#3D2B1F', textAlign: 'center' },
  scoreLabel: {
    fontSize: 11, fontWeight: '700', color: '#B5A499',
    textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  scoreBtn: {
    width: 56, height: 56, borderRadius: 14,
    backgroundColor: '#EDE3D7',
    alignItems: 'center', justifyContent: 'center',
  },
  scoreBtnSelected:     { backgroundColor: '#D4A437' },
  scoreBtnText:         { fontSize: 19, fontWeight: '700', color: '#C4B5A8' },
  scoreBtnTextSelected: { color: '#fff' },
  saveBtn: {
    backgroundColor: '#3D2B1F', borderRadius: 14,
    paddingVertical: 17, alignItems: 'center', marginTop: 2,
  },
  saveBtnDisabled: { backgroundColor: '#E5D9CB' },
  saveBtnText: { color: '#FFF8F0', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
});
