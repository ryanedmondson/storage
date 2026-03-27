export default {
  modes: {
    a: 'Mode A',
    b: 'Mode B',
  },
  buttonLabel: 'Change status',
  timings: {
    // Minutes before daily to-dos reset. Set low to test, use 1440 for once-per-day.
    dailyIntervalMinutes: 1,
  },
  sentiment: {
    label: 'Confidence level',
  },
  reminders: [
    { id: 'config_reminder_a_1', mode: 'a', label: 'Take a break', intervalMinutes: 60 },
    { id: 'config_reminder_a_2', mode: 'a', label: 'Drink water', intervalMinutes: 30 },
    { id: 'config_reminder_b_1', mode: 'b', label: 'Step away from screens', intervalMinutes: 90 },
    { id: 'config_reminder_b_2', mode: 'b', label: 'Check in with yourself', intervalMinutes: 120 },
  ],
  diary: {
    addButtonLabel: 'Add to diary',
    fields: [
      { id: 'notes', label: 'Notes' },
      { id: 'highlights', label: 'Highlights' },
      { id: 'challenges', label: 'Challenges' },
    ],
  },
  suggestedTodos: [
    // Mode A — fixed (must complete each time mode is activated)
    { id: 'suggested_a_fixed_1', mode: 'a', type: 'fixed', label: 'Review today\'s schedule' },
    { id: 'suggested_a_fixed_2', mode: 'a', type: 'fixed', label: 'Set top priority' },
    // Mode A — daily
    { id: 'suggested_a_1', mode: 'a', type: 'daily', label: 'Morning check-in' },
    { id: 'suggested_a_2', mode: 'a', type: 'daily', label: 'Clear inbox' },
    // Mode B — fixed
    { id: 'suggested_b_fixed_1', mode: 'b', type: 'fixed', label: 'Log progress' },
    { id: 'suggested_b_fixed_2', mode: 'b', type: 'fixed', label: 'Plan tomorrow' },
    // Mode B — daily
    { id: 'suggested_b_1', mode: 'b', type: 'daily', label: 'Wind-down review' },
    { id: 'suggested_b_2', mode: 'b', type: 'daily', label: 'Reflect on the day' },
  ],
};
