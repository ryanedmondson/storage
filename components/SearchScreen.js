import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import customers from '../customers.json';
import config from '../config';

export default function SearchScreen({ mode }) {
  const [query, setQuery] = useState('');

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
        <Text style={styles.modePill}>{config.modes[mode]}</Text>
      </View>

      {/* Search input */}
      <View style={styles.searchRow}>
        <Ionicons name="search" size={16} color="#B5A499" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search customers…"
          placeholderTextColor="#C4B5A8"
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close-circle" size={18} color="#C4B5A8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Results */}
      <FlatList
        data={filtered}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No customers match "{query}"</Text>
          </View>
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => {
          const rating = item.ratings[mode];
          const good = rating === 'good';
          return (
            <View style={styles.row}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
              </View>
              <Text style={styles.name}>{item.name}</Text>
              <View style={[styles.badge, good ? styles.badgeGood : styles.badgeBad]}>
                <Text style={[styles.badgeText, good ? styles.badgeTextGood : styles.badgeTextBad]}>
                  {good ? 'Good' : 'Bad'}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5EEE3' },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 24, paddingBottom: 12,
  },
  headerTitle: { fontSize: 30, fontWeight: '800', color: '#3D2B1F', letterSpacing: -0.5 },
  modePill: {
    fontSize: 12, fontWeight: '700', color: '#8C7B6B',
    backgroundColor: '#EDE3D7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12,
  },

  searchRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 16, marginBottom: 12,
    backgroundColor: '#FFFDF8', borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 11,
    borderWidth: 1, borderColor: '#E5D9CB',
    shadowColor: '#3D2B1F', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  searchIcon: { marginRight: 2 },
  input: { flex: 1, fontSize: 15, color: '#3D2B1F' },

  list: { paddingHorizontal: 16, paddingBottom: 40 },
  separator: { height: 1, backgroundColor: '#EDE3D7', marginLeft: 64 },

  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#FFFDF8', paddingHorizontal: 14, paddingVertical: 13,
  },
  avatar: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: '#EDE3D7', alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '700', color: '#8C7B6B' },
  name: { flex: 1, fontSize: 15, color: '#3D2B1F', fontWeight: '500' },

  badge: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
  },
  badgeGood: { backgroundColor: '#E8F5E9' },
  badgeBad:  { backgroundColor: '#FDECEA' },
  badgeText: { fontSize: 12, fontWeight: '700' },
  badgeTextGood: { color: '#2E7D32' },
  badgeTextBad:  { color: '#C0392B' },

  empty: { paddingTop: 48, alignItems: 'center' },
  emptyText: { fontSize: 14, color: '#B5A499' },
});
