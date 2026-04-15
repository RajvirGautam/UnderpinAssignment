const taskService = require('../src/services/taskService');

describe('taskService', () => {
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
});
