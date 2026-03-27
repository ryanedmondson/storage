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
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <Text style={styles.title}>{config.eventLog.buttonLabel}</Text>
              <Text style={styles.scoreLabel}>{config.eventLog.scoreLabel}</Text>

              <View style={styles.grid}>
                {SCORES.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.scoreBtn, selected === s && styles.scoreBtnSelected]}
                    onPress={() => setSelected(s)}
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
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  scoreBtn: {
    width: 52,
    height: 52,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreBtnSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  scoreBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ccc',
  },
  scoreBtnTextSelected: {
    color: '#fff',
  },
  saveBtn: {
    backgroundColor: '#000',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  saveBtnDisabled: {
    backgroundColor: '#e0e0e0',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
