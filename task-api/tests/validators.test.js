describe('validateAssignTask', () => {
  const { validateAssignTask } = require('../src/utils/validators');
  test('returns null for valid input', () => {
    expect(validateAssignTask({ assignee: 'alice' })).toBeNull();
  });
  test('returns error for missing assignee', () => {
    expect(typeof validateAssignTask({})).toBe('string');
  });
  test('returns error for empty string assignee', () => {
    expect(typeof validateAssignTask({ assignee: '' })).toBe('string');
  });
  test('returns error for non-string assignee', () => {
    expect(typeof validateAssignTask({ assignee: 123 })).toBe('string');
  });
});
const { validateCreateTask, validateUpdateTask } = require('../src/utils/validators');

describe('validateCreateTask', () => {
  test('returns null for valid input with all fields', () => {
    const result = validateCreateTask({
      title: 'Task',
      status: 'todo',
      priority: 'medium',
      dueDate: '2026-12-31T00:00:00.000Z',
    });
    expect(result).toBeNull();
  });

  test('returns null for input with only title', () => {
    expect(validateCreateTask({ title: 'Task' })).toBeNull();
  });

  test('returns error when title is missing', () => {
    expect(typeof validateCreateTask({})).toBe('string');
  });

  test('returns error when title is empty string', () => {
    expect(typeof validateCreateTask({ title: '' })).toBe('string');
  });

  test('returns error when title is whitespace only', () => {
    expect(typeof validateCreateTask({ title: '   ' })).toBe('string');
  });

  test('returns error when title is not a string (number, boolean)', () => {
    expect(typeof validateCreateTask({ title: 123 })).toBe('string');
    expect(typeof validateCreateTask({ title: true })).toBe('string');
  });

  test('returns null for each valid status (todo, in_progress, done)', () => {
    expect(validateCreateTask({ title: 'T', status: 'todo' })).toBeNull();
    expect(validateCreateTask({ title: 'T', status: 'in_progress' })).toBeNull();
    expect(validateCreateTask({ title: 'T', status: 'done' })).toBeNull();
  });

  test('returns error for invalid status (pending, completed)', () => {
    expect(typeof validateCreateTask({ title: 'T', status: 'pending' })).toBe('string');
    expect(typeof validateCreateTask({ title: 'T', status: 'completed' })).toBe('string');
  });

  test('returns null for each valid priority (low, medium, high)', () => {
    expect(validateCreateTask({ title: 'T', priority: 'low' })).toBeNull();
    expect(validateCreateTask({ title: 'T', priority: 'medium' })).toBeNull();
    expect(validateCreateTask({ title: 'T', priority: 'high' })).toBeNull();
  });

  test('returns error for invalid priority', () => {
    expect(typeof validateCreateTask({ title: 'T', priority: 'urgent' })).toBe('string');
  });

  test('returns null for valid ISO date dueDate', () => {
    expect(validateCreateTask({ title: 'T', dueDate: '2026-12-31T00:00:00.000Z' })).toBeNull();
  });

  test('returns error for invalid dueDate', () => {
    expect(typeof validateCreateTask({ title: 'T', dueDate: 'not-a-date' })).toBe('string');
  });
});

describe('validateUpdateTask', () => {
  test('returns null for empty body (no fields is valid for update)', () => {
    expect(validateUpdateTask({})).toBeNull();
  });

  test('returns error when title is present but empty string', () => {
    expect(typeof validateUpdateTask({ title: '' })).toBe('string');
  });

  test('returns error when title is present but whitespace only', () => {
    expect(typeof validateUpdateTask({ title: '   ' })).toBe('string');
  });

  test('allows title to be omitted entirely (unlike create)', () => {
    expect(validateUpdateTask({ status: 'todo' })).toBeNull();
  });

  test('returns error for invalid status', () => {
    expect(typeof validateUpdateTask({ status: 'pending' })).toBe('string');
  });

  test('returns error for invalid priority', () => {
    expect(typeof validateUpdateTask({ priority: 'urgent' })).toBe('string');
  });

  test('returns error for invalid dueDate', () => {
    expect(typeof validateUpdateTask({ dueDate: 'not-a-date' })).toBe('string');
  });
});
