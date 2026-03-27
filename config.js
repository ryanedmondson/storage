export default {
  modes: {
    a: 'Mode A',
    b: 'Mode B',
  },
  buttonLabel: 'Change status',
  sentiment: {
    label: 'Confidence level',
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
