import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import config from '../config';

const emptyFieldItems = () =>
  Object.fromEntries(config.diary.fields.map((f) => [f.id, []]));

const emptyFieldInputs = () =>
  Object.fromEntries(config.diary.fields.map((f) => [f.id, '']));

export default function DiaryEntryForm({ onSubmit, onCancel }) {
  const [fieldItems, setFieldItems] = useState(emptyFieldItems);
  const [fieldInputs, setFieldInputs] = useState(emptyFieldInputs);
  const inputRefs = useRef({});

  const addItem = (fieldId) => {
    const text = fieldInputs[fieldId].trim();
    if (!text) return;
    setFieldItems((prev) => ({ ...prev, [fieldId]: [...prev[fieldId], text] }));
    setFieldInputs((prev) => ({ ...prev, [fieldId]: '' }));
    inputRefs.current[fieldId]?.focus();
  };

  const removeItem = (fieldId, index) => {
    setFieldItems((prev) => ({
      ...prev,
      [fieldId]: prev[fieldId].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    const hasAny = config.diary.fields.some((f) => fieldItems[f.id].length > 0);
    if (!hasAny) return;
    onSubmit(fieldItems);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel}>
            <Text style={styles.cancelBtn}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New entry</Text>
          <TouchableOpacity onPress={handleSubmit}>
            <Text style={styles.submitBtn}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          {config.diary.fields.map((field) => (
            <View key={field.id} style={styles.fieldSection}>
              <Text style={styles.fieldLabel}>{field.label}</Text>

              {fieldItems[field.id].map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <Text style={styles.bullet}>·</Text>
                  <Text style={styles.itemText}>{item}</Text>
                  <TouchableOpacity onPress={() => removeItem(field.id, index)}>
                    <Text style={styles.removeBtn}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}

              <View style={styles.inputRow}>
                <TextInput
                  ref={(r) => { inputRefs.current[field.id] = r; }}
                  style={styles.input}
                  placeholder={`Add ${field.label.toLowerCase()}…`}
                  placeholderTextColor="#bbb"
                  value={fieldInputs[field.id]}
                  onChangeText={(text) =>
                    setFieldInputs((prev) => ({ ...prev, [field.id]: text }))
                  }
                  onSubmitEditing={() => addItem(field.id)}
                  returnKeyType="done"
                  blurOnSubmit={false}
                />
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={() => addItem(field.id)}
                >
                  <Text style={styles.addBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5EEE3' },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5D9CB',
    backgroundColor: '#FFFDF8',
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#3D2B1F' },
  cancelBtn: { fontSize: 16, color: '#8C7B6B' },
  submitBtn: { fontSize: 16, color: '#3D2B1F', fontWeight: '700' },
  scroll: { flex: 1 },
  content: { padding: 20, gap: 28, paddingBottom: 40 },
  fieldSection: { gap: 10 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B5A499',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  bullet: { fontSize: 18, color: '#C4B5A8' },
  itemText: { flex: 1, fontSize: 15, color: '#3D2B1F' },
  removeBtn: { fontSize: 13, color: '#C4B5A8', paddingHorizontal: 4 },
  inputRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5D9CB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 15,
    color: '#3D2B1F',
    backgroundColor: '#FFFDF8',
  },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#3D2B1F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: { color: '#FFF8F0', fontSize: 22, lineHeight: 26 },
});
