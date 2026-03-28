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
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 44, gap: 18,
    alignItems: 'stretch',
  },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: '#E0E0E0', alignSelf: 'center', marginBottom: 4,
  },
  title: { fontSize: 20, fontWeight: '800', color: '#1A1A1A', textAlign: 'center' },
  scoreLabel: {
    fontSize: 11, fontWeight: '700', color: '#B0B0B0',
    textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center',
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  scoreBtn: {
    width: 56, height: 56, borderRadius: 14,
    backgroundColor: '#F5F5F5',
    alignItems: 'center', justifyContent: 'center',
  },
  scoreBtnSelected:     { backgroundColor: '#1A1A1A' },
  scoreBtnText:         { fontSize: 19, fontWeight: '700', color: '#C0C0C0' },
  scoreBtnTextSelected: { color: '#fff' },
  saveBtn: {
    backgroundColor: '#1A1A1A', borderRadius: 14,
    paddingVertical: 17, alignItems: 'center', marginTop: 2,
  },
  saveBtnDisabled: { backgroundColor: '#EBEBEB' },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
});
