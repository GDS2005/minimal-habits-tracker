const VALID_COLORS = new Set(['gold', 'up', 'sky', 'violet']);
const VALID_STATUSES = new Set(['pending', 'done', 'skipped']);
const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

function validationError(code, message) {
  const error = new Error(message);
  error.status = 400;
  error.code = code;
  return error;
}

function validateHabitInput(body, { partial = false } = {}) {
  const input = body || {};
  const result = {};

  if (!partial || input.name !== undefined) {
    if (typeof input.name !== 'string' || !input.name.trim()) {
      throw validationError('INVALID_NAME', 'name must be a non-empty string');
    }
    if (input.name.trim().length > 120) {
      throw validationError('NAME_TOO_LONG', 'name must be 120 characters or fewer');
    }
    result.name = input.name.trim();
  }

  if (!partial || input.time !== undefined) {
    if (typeof input.time !== 'string' || !TIME_PATTERN.test(input.time)) {
      throw validationError('INVALID_TIME', 'time must use HH:mm format');
    }
    result.time = input.time;
  }

  if (input.color !== undefined) {
    if (typeof input.color !== 'string' || !VALID_COLORS.has(input.color)) {
      throw validationError('INVALID_COLOR', 'color is not supported');
    }
    result.color = input.color;
  }

  if (input.status !== undefined) {
    if (typeof input.status !== 'string' || !VALID_STATUSES.has(input.status)) {
      throw validationError('INVALID_STATUS', 'status is not supported');
    }
    result.status = input.status;
  }

  return result;
}

function validateDateKey(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw validationError('INVALID_DATE', 'date must use YYYY-MM-DD format');
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw validationError('INVALID_DATE', 'date must be a valid calendar date');
  }
}

module.exports = { validateDateKey, validateHabitInput };