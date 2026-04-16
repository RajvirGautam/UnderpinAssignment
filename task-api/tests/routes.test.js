describe('Task API Integration (assign)', () => {
  beforeEach(() => taskService._reset());

  test('PATCH /tasks/:id/assign with valid body → 200, task has assignee', async () => {
    const t = taskService.create({ title: 'T' });
    const res = await request(app).patch(`/tasks/${t.id}/assign`).send({ assignee: 'alice' });
    expect(res.status).toBe(200);
    expect(res.body.assignee).toBe('alice');
  });

  test('PATCH /tasks/:id/assign with non-existent ID → 404', async () => {
    const res = await request(app).patch('/tasks/not-real-id/assign').send({ assignee: 'alice' });
    expect(res.status).toBe(404);
  });

  test('PATCH /tasks/:id/assign with missing assignee → 400', async () => {
    const t = taskService.create({ title: 'T' });
    const res = await request(app).patch(`/tasks/${t.id}/assign`).send({});
    expect(res.status).toBe(400);
  });

  test('PATCH /tasks/:id/assign with empty string → 400', async () => {
    const t = taskService.create({ title: 'T' });
    const res = await request(app).patch(`/tasks/${t.id}/assign`).send({ assignee: '' });
    expect(res.status).toBe(400);
  });

  test('PATCH /tasks/:id/assign on already-assigned task → 200, assignee updated', async () => {
    const t = taskService.create({ title: 'T', assignee: 'alice' });
    const res = await request(app).patch(`/tasks/${t.id}/assign`).send({ assignee: 'bob' });
    expect(res.status).toBe(200);
    expect(res.body.assignee).toBe('bob');
  });

  test('assigned task persists — GET /tasks shows the assignee', async () => {
    const t = taskService.create({ title: 'T' });
    await request(app).patch(`/tasks/${t.id}/assign`).send({ assignee: 'alice' });
    const res = await request(app).get('/tasks');
    expect(res.body[0].assignee).toBe('alice');
  });
});
const request = require('supertest');
const app = require('../src/app');
const taskService = require('../src/services/taskService');

describe('Task API Integration', () => {
  beforeEach(() => taskService._reset());

  test('GET /tasks returns 200 and empty array when no tasks exist', async () => {
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('GET /tasks returns 200 and all tasks after creating some', async () => {
    const t1 = taskService.create({ title: 'T1' });
    const t2 = taskService.create({ title: 'T2' });
    const res = await request(app).get('/tasks');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([t1, t2]);
  });

  test('GET /tasks?status=todo returns only tasks with that status', async () => {
    const t1 = taskService.create({ title: 'T1', status: 'todo' });
    taskService.create({ title: 'T2', status: 'done' });
    const res = await request(app).get('/tasks?status=todo');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([t1]);
  });

  test('GET /tasks?status=nonexistent returns empty array', async () => {
    taskService.create({ title: 'T1', status: 'todo' });
    const res = await request(app).get('/tasks?status=nonexistent');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('GET /tasks?page=1&limit=2 returns correct paginated results', async () => {
    const t1 = taskService.create({ title: 'T1' });
    const t2 = taskService.create({ title: 'T2' });
    const t3 = taskService.create({ title: 'T3' });
    const res = await request(app).get('/tasks?page=1&limit=2');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([t1, t2]);
  });

  test('GET /tasks?page=999 returns empty array for out-of-range page', async () => {
    taskService.create({ title: 'T1' });
    const res = await request(app).get('/tasks?page=999');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe('Task API Integration (mutations)', () => {
  beforeEach(() => taskService._reset());

  test('POST /tasks returns 201 with the created task containing all expected fields', async () => {
    const res = await request(app).post('/tasks').send({ title: 'New Task' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: 'New Task', status: 'todo', priority: 'medium' });
    expect(typeof res.body.id).toBe('string');
    expect(typeof res.body.createdAt).toBe('string');
  });

  test('POST /tasks returns 400 when title is missing', async () => {
    const res = await request(app).post('/tasks').send({});
    expect(res.status).toBe(400);
  });

  test('POST /tasks returns 400 when title is empty string', async () => {
    const res = await request(app).post('/tasks').send({ title: '' });
    expect(res.status).toBe(400);
  });

  test('POST /tasks returns 400 for invalid status', async () => {
    const res = await request(app).post('/tasks').send({ title: 'T', status: 'pending' });
    expect(res.status).toBe(400);
  });

  test('POST /tasks returns 400 for invalid priority', async () => {
    const res = await request(app).post('/tasks').send({ title: 'T', priority: 'urgent' });
    expect(res.status).toBe(400);
  });

  test('POST /tasks returns 400 for invalid dueDate', async () => {
    const res = await request(app).post('/tasks').send({ title: 'T', dueDate: 'not-a-date' });
    expect(res.status).toBe(400);
  });

  test('PUT /tasks/:id returns 200 with updated task', async () => {
    const t = taskService.create({ title: 'T' });
    const res = await request(app).put(`/tasks/${t.id}`).send({ title: 'Updated' });
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated');
  });

  test('PUT /tasks/:id returns 404 for non-existent ID', async () => {
    const res = await request(app).put('/tasks/not-real-id').send({ title: 'Updated' });
    expect(res.status).toBe(404);
  });

  test('PUT /tasks/:id returns 400 for invalid fields', async () => {
    const t = taskService.create({ title: 'T' });
    const res = await request(app).put(`/tasks/${t.id}`).send({ status: 'pending' });
    expect(res.status).toBe(400);
  });

  test('DELETE /tasks/:id returns 204 with no body', async () => {
    const t = taskService.create({ title: 'T' });
    const res = await request(app).delete(`/tasks/${t.id}`);
    expect(res.status).toBe(204);
    expect(res.body).toEqual({});
  });

  test('DELETE /tasks/:id returns 404 for non-existent ID', async () => {
    const res = await request(app).delete('/tasks/not-real-id');
    expect(res.status).toBe(404);
  });

  test('DELETE /tasks/:id task is actually removed (GET returns fewer results)', async () => {
    const t1 = taskService.create({ title: 'T1' });
    const t2 = taskService.create({ title: 'T2' });
    await request(app).delete(`/tasks/${t1.id}`);
    const res = await request(app).get('/tasks');
    expect(res.body).toEqual([t2]);
  });

  test('PATCH /tasks/:id/complete returns 200 with status: done and completedAt set', async () => {
    const t = taskService.create({ title: 'T' });
    const res = await request(app).patch(`/tasks/${t.id}/complete`).send();
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('done');
    expect(typeof res.body.completedAt).toBe('string');
  });

  test('PATCH /tasks/:id/complete returns 404 for non-existent ID', async () => {
    const res = await request(app).patch('/tasks/not-real-id/complete').send();
    expect(res.status).toBe(404);
  });

  test('GET /tasks/stats returns correct counts with no tasks', async () => {
    const res = await request(app).get('/tasks/stats');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ todo: 0, in_progress: 0, done: 0, overdue: 0 });
  });

  test('GET /tasks/stats returns correct counts after creating tasks with various statuses', async () => {
    taskService.create({ title: 'T1', status: 'todo' });
    taskService.create({ title: 'T2', status: 'in_progress' });
    taskService.create({ title: 'T3', status: 'done' });
    const res = await request(app).get('/tasks/stats');
    expect(res.body).toEqual({ todo: 1, in_progress: 1, done: 1, overdue: 0 });
  });

  test('GET /tasks/stats correctly identifies overdue tasks', async () => {
    const past = new Date(Date.now() - 86400000).toISOString();
    taskService.create({ title: 'T1', status: 'todo', dueDate: past });
    const res = await request(app).get('/tasks/stats');
    expect(res.body.overdue).toBe(1);
  });
});
