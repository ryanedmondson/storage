import { useState } from 'react';
import {
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import config from '../config';
import useDailyState from '../hooks/useDailyState';
import DataScreen from './DataScreen';

const SCREEN_WIDTH = Dimensions.get('window').width;

// ── Metric definitions ─────────────────────────────────────────────────────────

const METRICS = [
  { id: 'sentiment',      label: 'Sentiment',              color: '#111', maxValue: 5,   suffix: '/5'  },
  { id: 'todos_completed', label: 'Todos completed',        color: '#333', maxValue: null, suffix: ''   },
  { id: 'todos_rate',     label: 'Completion rate',        color: '#555', maxValue: 100, suffix: '%'  },
  { id: 'todos_stacked',  label: 'Todos by mode (stacked)', isStacked: true               },
  { id: 'events_count',   label: 'Events logged',          color: '#777', maxValue: null, suffix: ''   },
  { id: 'events_avg',     label: 'Avg event score',        color: '#999', maxValue: 10,  suffix: '/10'},
  { id: 'diary_count',    label: 'Diary entries',          color: '#bbb', maxValue: null, suffix: ''   },
];

const SECONDARY_METRICS = [
  { id: 'none', label: 'None' },
  ...METRICS.filter((m) => !m.isStacked),
];

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmtLabel(date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function todoCounts(todos) {
  let doneA = 0, totalA = 0, doneB = 0, totalB = 0;
  for (const t of ['fixed', 'daily']) {
    const a = todos?.a?.[t] ?? [];
    const b = todos?.b?.[t] ?? [];
    totalA += a.length;
    doneA += a.filter((x) => x.completed).length;
    totalB += b.length;
    doneB += b.filter((x) => x.completed).length;
  }
  return { doneA, totalA, doneB, totalB, doneTotal: doneA + doneB, total: totalA + totalB };
}

function getMetricValue(session, metricId) {
  switch (metricId) {
    case 'sentiment':
      return session.sentiment ?? 0;
    case 'todos_completed':
      return todoCounts(session.todos).doneTotal;
    case 'todos_rate': {
      const { doneTotal, total } = todoCounts(session.todos);
      return total > 0 ? Math.round((doneTotal / total) * 100) : 0;
    }
    case 'events_count':
      return session.events?.length ?? 0;
    case 'events_avg': {
      const evts = session.events ?? [];
      if (!evts.length) return 0;
      return Math.round((evts.reduce((s, e) => s + e.score, 0) / evts.length) * 10) / 10;
    }
    case 'diary_count':
      return session.diary?.length ?? 0;
    default:
      return 0;
  }
}

function niceMax(values, def) {
  if (def?.maxValue != null) return def.maxValue;
  const raw = Math.max(...values, 1);
  const step = Math.pow(10, Math.floor(Math.log10(raw)));
  return Math.ceil(raw / step) * step;
}

function avg(arr) {
  if (!arr.length) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

// ── MetricPicker ───────────────────────────────────────────────────────────────

function MetricPicker({ label, value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.id === value);
  return (
    <>
      <View style={styles.pickerRow}>
        <Text style={styles.pickerLabel}>{label}</Text>
        <TouchableOpacity style={styles.pickerBtn} onPress={() => setOpen(true)}>
          <Text style={styles.pickerBtnText}>{selected?.label ?? 'Select'}</Text>
          <Text style={styles.pickerCaret}>›</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={open} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{label}</Text>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={styles.sheetOption}
                onPress={() => { onChange(opt.id); setOpen(false); }}
              >
                <Text style={[styles.sheetOptionText, opt.id === value && styles.sheetOptionActive]}>
                  {opt.label}
                </Text>
                {opt.id === value && <Text style={styles.sheetCheck}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

// ── InsightsScreen ─────────────────────────────────────────────────────────────

export default function InsightsScreen() {
  const { sessions } = useDailyState();
  const [primaryId, setPrimaryId] = useState('sentiment');
  const [secondaryId, setSecondaryId] = useState('none');
  const [showData, setShowData] = useState(false);

  const primaryDef = METRICS.find((m) => m.id === primaryId);
  const secondaryDef = secondaryId !== 'none' ? METRICS.find((m) => m.id === secondaryId) : null;

  // Oldest → newest for charts
  const ordered = [...sessions].reverse();
  const hasData = ordered.length > 0;

  const primaryValues = ordered.map((s) => getMetricValue(s, primaryId));
  const secondaryValues = secondaryDef
    ? ordered.map((s) => getMetricValue(s, secondaryDef.id))
    : [];

  const primaryMax = primaryDef?.isStacked ? undefined : niceMax(primaryValues, primaryDef);
  const secondaryMax = secondaryDef ? niceMax(secondaryValues, secondaryDef) : undefined;

  // Bar data
  const barData = ordered.map((s, i) => ({
    value: primaryValues[i],
    label: fmtLabel(s.startTime),
    frontColor: primaryDef?.color ?? '#111',
  }));

  // Stacked data (todos by mode)
  const stackData = ordered.map((s) => {
    const { doneA, doneB } = todoCounts(s.todos);
    return {
      stacks: [
        { value: doneA || 0, color: '#111', marginBottom: 2 },
        { value: doneB || 0, color: '#888' },
      ],
      label: fmtLabel(s.startTime),
    };
  });

  // Line (secondary)
  const lineData = secondaryDef ? ordered.map((s, i) => ({ value: secondaryValues[i] })) : null;

  // Chart dimensions
  const barSlotWidth = 38;
  const chartWidth = Math.max(SCREEN_WIDTH - 72, ordered.length * barSlotWidth);

  const modeALabel = config.modes.a;
  const modeBLabel = config.modes.b;

  return (
    <View style={styles.safe}>
      {/* Data modal */}
      <Modal visible={showData} animationType="slide">
        <DataScreen onClose={() => setShowData(false)} />
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Insights</Text>
        <TouchableOpacity style={styles.dataBtn} onPress={() => setShowData(true)}>
          <Text style={styles.dataBtnText}>Raw data</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Metric selectors */}
        <View style={styles.card}>
          <MetricPicker
            label="Primary"
            value={primaryId}
            onChange={(id) => {
              setPrimaryId(id);
              if (id === secondaryId) setSecondaryId('none');
            }}
            options={METRICS}
          />
          <View style={styles.cardDivider} />
          <MetricPicker
            label="Second axis"
            value={secondaryId}
            onChange={(id) => {
              if (id !== 'none' && id === primaryId) return;
              setSecondaryId(id);
            }}
            options={SECONDARY_METRICS.filter((o) => o.id !== primaryId || o.id === 'none')}
          />
        </View>

        {!hasData ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No data yet</Text>
            <Text style={styles.emptySub}>Keep tracking — your insights will appear here.</Text>
          </View>
        ) : (
          <>
            {/* Legend */}
            <View style={styles.legend}>
              {primaryDef?.isStacked ? (
                <>
                  <LegendDot color="#111" label={`${modeALabel} todos`} />
                  <LegendDot color="#888" label={`${modeBLabel} todos`} />
                </>
              ) : (
                <LegendDot color={primaryDef?.color ?? '#111'} label={primaryDef?.label} />
              )}
              {secondaryDef && (
                <LegendLine color="#e74c3c" label={secondaryDef.label} />
              )}
            </View>

            {/* Chart */}
            <View style={styles.chartCard}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {primaryDef?.isStacked ? (
                  <BarChart
                    stackData={stackData}
                    width={chartWidth}
                    barWidth={22}
                    spacing={16}
                    noOfSections={4}
                    xAxisColor="#ebebeb"
                    yAxisColor="#ebebeb"
                    rulesColor="#f5f5f5"
                    xAxisLabelTextStyle={styles.axisLabel}
                    yAxisTextStyle={styles.axisLabel}
                    isAnimated
                  />
                ) : (
                  <BarChart
                    data={barData}
                    width={chartWidth}
                    barWidth={22}
                    spacing={16}
                    noOfSections={5}
                    maxValue={primaryMax}
                    roundedTop
                    xAxisColor="#ebebeb"
                    yAxisColor="#ebebeb"
                    rulesColor="#f5f5f5"
                    xAxisLabelTextStyle={styles.axisLabel}
                    yAxisTextStyle={styles.axisLabel}
                    showLine={!!secondaryDef}
                    lineData={lineData ?? undefined}
                    lineConfig={
                      secondaryDef
                        ? {
                            color: '#e74c3c',
                            thickness: 2,
                            dataPointsColor: '#e74c3c',
                            dataPointsRadius: 3,
                            isSecondary: true,
                          }
                        : undefined
                    }
                    secondaryYAxis={
                      secondaryDef
                        ? {
                            maxValue: secondaryMax,
                            noOfSections: 5,
                            yAxisColor: '#f0c0bb',
                            yAxisTextStyle: { ...styles.axisLabel, color: '#e74c3c' },
                          }
                        : undefined
                    }
                    isAnimated
                  />
                )}
              </ScrollView>
            </View>

            {/* Summary stats (non-stacked only) */}
            {!primaryDef?.isStacked && primaryValues.length > 0 && (
              <View style={styles.statsRow}>
                {[
                  { label: 'Sessions', value: ordered.length },
                  {
                    label: 'Avg',
                    value: avg(primaryValues).toFixed(1),
                    suffix: primaryDef?.suffix ?? '',
                  },
                  { label: 'Max', value: Math.max(...primaryValues), suffix: primaryDef?.suffix ?? '' },
                  { label: 'Min', value: Math.min(...primaryValues), suffix: primaryDef?.suffix ?? '' },
                ].map((stat) => (
                  <View key={stat.label} style={styles.statBox}>
                    <Text style={styles.statValue}>
                      {stat.value}
                      {stat.suffix ? <Text style={styles.statSuffix}>{stat.suffix}</Text> : null}
                    </Text>
                    <Text style={styles.statLabel}>{stat.label}</Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function LegendDot({ color, label }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

function LegendLine({ color, label }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendLineSwatch, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5EEE3' },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 24, paddingBottom: 12,
  },
  headerTitle: { fontSize: 30, fontWeight: '800', color: '#3D2B1F', letterSpacing: -0.5 },
  dataBtn: {
    backgroundColor: '#EDE3D7', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
  },
  dataBtnText: { fontSize: 13, fontWeight: '600', color: '#8C7B6B' },

  content: { padding: 16, gap: 14, paddingBottom: 40 },

  // Pickers
  card: {
    backgroundColor: '#FFFDF8', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 4,
    shadowColor: '#3D2B1F', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
  },
  cardDivider: { height: 1, backgroundColor: '#EDE3D7' },
  pickerRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14,
  },
  pickerLabel: { fontSize: 15, fontWeight: '600', color: '#3D2B1F' },
  pickerBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pickerBtnText: { fontSize: 14, color: '#B5A499', fontWeight: '500' },
  pickerCaret: { fontSize: 20, color: '#C4B5A8', lineHeight: 22 },

  // Modal sheet
  overlay: { flex: 1, backgroundColor: 'rgba(61,43,31,0.35)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#FFFDF8', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40,
  },
  sheetTitle: {
    fontSize: 11, fontWeight: '700', color: '#B5A499',
    textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10,
  },
  sheetOption: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#EDE3D7',
  },
  sheetOptionText: { fontSize: 16, color: '#3D2B1F', fontWeight: '400' },
  sheetOptionActive: { fontWeight: '700', color: '#3D2B1F' },
  sheetCheck: { fontSize: 15, color: '#D4A437', fontWeight: '700' },

  // Legend
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 4 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendLineSwatch: { width: 18, height: 3, borderRadius: 2 },
  legendText: { fontSize: 12, color: '#8C7B6B', fontWeight: '500' },

  // Chart
  chartCard: {
    backgroundColor: '#FFFDF8', borderRadius: 16, padding: 14, overflow: 'hidden',
    shadowColor: '#3D2B1F', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
  },
  axisLabel: { fontSize: 9, color: '#C4B5A8' },

  // Stats
  statsRow: { flexDirection: 'row', gap: 10 },
  statBox: {
    flex: 1, backgroundColor: '#FFFDF8', borderRadius: 16,
    paddingVertical: 16, alignItems: 'center',
    shadowColor: '#3D2B1F', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
  },
  statValue: { fontSize: 22, fontWeight: '800', color: '#3D2B1F' },
  statSuffix: { fontSize: 12, fontWeight: '400', color: '#B5A499' },
  statLabel: { fontSize: 10, color: '#B5A499', fontWeight: '600', marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.5 },

  // Empty
  empty: { alignItems: 'center', paddingVertical: 64 },
  emptyTitle: { fontSize: 17, fontWeight: '700', color: '#3D2B1F', marginBottom: 6 },
  emptySub: { fontSize: 14, color: '#B5A499', textAlign: 'center' },
});
