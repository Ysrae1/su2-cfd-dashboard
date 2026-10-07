(function (factory) {
  'use strict';
  const rollingRanges = factory();
  if (typeof module === 'object' && module.exports) module.exports = rollingRanges;
  if (typeof window !== 'undefined') window.dashboardRollingRanges = rollingRanges;
})(function () {
  'use strict';

  // Each value enters and leaves each monotonic queue at most once.
  function makeQueue(windowSize, minimum) {
    const indices = [];
    const values = [];
    let head = 0;
    return {
      clear() {
        indices.length = values.length = head = 0;
      },
      add(index, value) {
        while (head < indices.length && indices[head] <= index - windowSize) head++;
        while (values.length > head &&
          (minimum ? values[values.length - 1] >= value : values[values.length - 1] <= value)) {
          indices.pop();
          values.pop();
        }
        indices.push(index);
        values.push(value);
        // Compact only after at least one window of expired entries; total
        // copying stays linear and storage stays proportional to the window.
        if (head >= windowSize && head * 2 >= indices.length) {
          indices.splice(0, head);
          values.splice(0, head);
          head = 0;
        }
      },
      value() { return values[head]; }
    };
  }

  function contiguous(previous, current) {
    if (current.break_before || current.run !== previous.run ||
      current.group_id !== previous.group_id) return false;
    const hasLocal = Number.isFinite(previous.local_iteration) &&
      Number.isFinite(current.local_iteration);
    const key = hasLocal ? 'local_iteration' : 'iteration';
    return Number.isFinite(previous[key]) && Number.isFinite(current[key]) &&
      current[key] === previous[key] + 1;
  }

  return function dashboardRollingRanges(rows, windows = [250, 1250]) {
    if (!Array.isArray(rows) || !Array.isArray(windows)) {
      throw new TypeError('Rows and windows must be arrays.');
    }
    const sizes = Array.from(new Set(windows));
    if (sizes.some(size => !Number.isSafeInteger(size) || size <= 0)) {
      throw new RangeError('Window sizes must be positive integers.');
    }
    const states = ['CL', 'CD'].flatMap(field => sizes.map(size => ({
      field, size, key: `${field}_range_${size}`, count: 0,
      minimum: makeQueue(size, true), maximum: makeQueue(size, false)
    })));
    const reset = state => {
      state.count = 0;
      state.minimum.clear();
      state.maximum.clear();
    };
    let previous;
    return rows.map((row, index) => {
      if (row === null || typeof row !== 'object' || Array.isArray(row)) {
        throw new TypeError('Each row must be a record.');
      }
      if (!previous || !contiguous(previous, row)) states.forEach(reset);
      const result = { ...row };
      states.forEach(state => {
        const value = row[state.field];
        if (!Number.isFinite(value)) {
          reset(state);
          result[state.key] = null;
          return;
        }
        state.count = Math.min(state.count + 1, state.size);
        state.minimum.add(index, value);
        state.maximum.add(index, value);
        result[state.key] = state.count === state.size
          ? state.maximum.value() - state.minimum.value() : null;
      });
      previous = row;
      return result;
    });
  };
});
