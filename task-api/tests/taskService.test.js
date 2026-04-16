
const taskService = require('../src/services/taskService');

describe('taskService', () => {
  describe('assignTask', () => {
    test('assignTask() assigns a user to an existing task', () => {
      const t = taskService.create({ title: 'T' });
      const updated = taskService.assignTask(t.id, 'alice');
      expect(updated.assignee).toBe('alice');
    });
    test('assignTask() returns null for non-existent task', () => {
      expect(taskService.assignTask('not-real-id', 'bob')).toBeNull();
    });
    test('assignTask() overwrites a previously assigned user (re-assignment works)', () => {
      const t = taskService.create({ title: 'T', assignee: 'alice' });
      taskService.assignTask(t.id, 'bob');
      expect(taskService.findById(t.id).assignee).toBe('bob');
    });
  });
  afterEach(() => {
    taskService._reset();
  });

  test('_reset() clears all tasks from the in-memory store', () => {
    // Arrange: create a task
    taskService.create({ title: 'Sample Task' });
    expect(taskService.getAll().length).toBe(1);
    // Act: reset
    taskService._reset();
    // Assert: store is empty
    expect(taskService.getAll()).toEqual([]);
  });
  
  test('create() creates a task with all fields provided (except completedAt, which is always null)', () => {
    const now = new Date().toISOString();
    const task = taskService.create({
      title: 'Test Task',
      status: 'in_progress',
      priority: 'high',
      dueDate: now,
      completedAt: now
    });
    expect(task).toMatchObject({
      title: 'Test Task',
      status: 'in_progress',
      priority: 'high',
      dueDate: now,
      completedAt: null
    });
    expect(typeof task.id).toBe('string');
    expect(typeof task.createdAt).toBe('string');
  });

  test('create() defaults status, priority, dueDate, completedAt when only title given', () => {
    const task = taskService.create({ title: 'Default Task' });
    expect(task).toMatchObject({
      title: 'Default Task',
      status: 'todo',
      priority: 'medium',
      dueDate: null,
      completedAt: null
    });
  });

  test('create() returned task has a valid UUID id and ISO createdAt', () => {
    const task = taskService.create({ title: 'UUID/ISO Test' });
    // UUID v4 regex
    expect(task.id).toMatch(/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i);
    // ISO 8601 regex
    expect(task.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  test('create() task is persisted (retrievable via getAll())', () => {
    const task = taskService.create({ title: 'Persisted Task' });
    const all = taskService.getAll();
    expect(all).toContainEqual(task);
  });

  test('getAll() returns empty array when no tasks exist', () => {
    taskService._reset();
    expect(taskService.getAll()).toEqual([]);
  });

  test('getAll() returns all created tasks', () => {
    taskService._reset();
    const t1 = taskService.create({ title: 'T1' });
    const t2 = taskService.create({ title: 'T2' });
    expect(taskService.getAll()).toEqual([t1, t2]);
  });

  test('getAll() returns a copy, not a reference', () => {
    taskService._reset();
    taskService.create({ title: 'T1' });
    const arr = taskService.getAll();
    arr.push({ title: 'Fake' });
    expect(taskService.getAll().length).toBe(1);
  });

  test('findById() returns correct task for a valid ID', () => {
    taskService._reset();
    const task = taskService.create({ title: 'Find Me' });
    expect(taskService.findById(task.id)).toEqual(task);
  });

  test('findById() returns undefined for a non-existent ID', () => {
    taskService._reset();
    expect(taskService.findById('not-a-real-id')).toBeUndefined();
  });

  describe('getByStatus()', () => {
    beforeEach(() => taskService._reset());
    test('returns only tasks with the exact matching status', () => {
      const t1 = taskService.create({ title: 'T1', status: 'todo' });
      const t2 = taskService.create({ title: 'T2', status: 'in_progress' });
      expect(taskService.getByStatus('todo')).toEqual([t1]);
      expect(taskService.getByStatus('in_progress')).toEqual([t2]);
    });
    test('returns empty array when no tasks match', () => {
      taskService.create({ title: 'T1', status: 'todo' });
      expect(taskService.getByStatus('done')).toEqual([]);
    });
    test('catches bug: substring match instead of exact', () => {
      const t1 = taskService.create({ title: 'T1', status: 'in_progress' });
      // Should not match 'in' to 'in_progress'
      expect(taskService.getByStatus('in')).toEqual([]);
    });
  });

  describe('getPaginated()', () => {
    beforeEach(() => taskService._reset());
    test('page 1 returns the first limit items', () => {
      const t1 = taskService.create({ title: 'T1' });
      const t2 = taskService.create({ title: 'T2' });
      const t3 = taskService.create({ title: 'T3' });
      expect(taskService.getPaginated(1, 2)).toEqual([t1, t2]);
    });
    test('catches bug: page 1 skips all first-page results (off-by-one)', () => {
      const t1 = taskService.create({ title: 'T1' });
      const t2 = taskService.create({ title: 'T2' });
      expect(taskService.getPaginated(1, 2)).toEqual([t1, t2]);
    });
    test('returns empty array for out-of-range page', () => {
      taskService.create({ title: 'T1' });
      expect(taskService.getPaginated(10, 2)).toEqual([]);
    });
    test('handles limit larger than total tasks', () => {
      const t1 = taskService.create({ title: 'T1' });
      expect(taskService.getPaginated(1, 10)).toEqual([t1]);
    });
  });
});
