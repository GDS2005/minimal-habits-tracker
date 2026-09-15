const test = require('node:test');
const assert = require('node:assert/strict');
const { validateDateKey, validateHabitInput } = require('./habit.validation');

test('normalizes a valid habit', () => {
  assert.deepEqual(
    validateHabitInput({ name: '  Read  ', time: '21:00', color: 'sky' }),
    { name: 'Read', time: '21:00', color: 'sky' }
  );
});

test('rejects blank names and invalid times', () => {
  assert.throws(
    () => validateHabitInput({ name: '   ', time: '08:00' }),
    { code: 'INVALID_NAME', status: 400 }
  );
  assert.throws(
    () => validateHabitInput({ name: 'Read', time: '25:00' }),
    { code: 'INVALID_TIME', status: 400 }
  );
});

test('validates calendar dates instead of only date shape', () => {
  assert.doesNotThrow(() => validateDateKey('2026-09-15'));
  assert.throws(
    () => validateDateKey('2026-02-30'),
    { code: 'INVALID_DATE', status: 400 }
  );
});