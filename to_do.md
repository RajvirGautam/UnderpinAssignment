# Everything To Do — The Untested API Assignment

---

## Setup

1. Install dependencies — `cd task-api && npm install`
2. Verify server starts — `npm start` on port 3000
3. Verify test runner works — `npm test`

---

## Tests to Write

### Unit Tests — `tests/taskService.test.js`

4. Test `_reset()` clears all tasks from the in-memory store
5. Test `create()` — creates a task with all fields provided
6. Test `create()` — defaults `status` to `'todo'`, `priority` to `'medium'`, `dueDate` to `null`, `completedAt` to `null` when only `title` given
7. Test `create()` — returned task has a valid UUID `id` and ISO `createdAt`
8. Test `create()` — task is persisted (retrievable via `getAll()`)
9. Test `getAll()` — returns empty array when no tasks exist
10. Test `getAll()` — returns all created tasks
11. Test `getAll()` — returns a copy, not a reference (mutating the returned array doesn't affect the store)
12. Test `findById()` — returns correct task for a valid ID
13. Test `findById()` — returns `undefined` for a non-existent ID
14. Test `getByStatus()` — returns only tasks with the exact matching status
15. Test `getByStatus()` — returns empty array when no tasks match
16. Test `getByStatus()` — **catches the bug:** currently uses `.includes()` (substring match) instead of `===` (exact match), so `'in'` incorrectly matches `'in_progress'`
17. Test `getPaginated()` — page 1 returns the first `limit` items
18. Test `getPaginated()` — **catches the bug:** currently page 1 skips all first-page results because offset is `page * limit` instead of `(page - 1) * limit`
19. Test `getPaginated()` — returns empty array for out-of-range page
20. Test `getPaginated()` — handles `limit` larger than total tasks
21. Test `getStats()` — returns `{ todo: 0, in_progress: 0, done: 0, overdue: 0 }` when no tasks exist
22. Test `getStats()` — returns correct counts for each status
23. Test `getStats()` — counts tasks with past `dueDate` and non-done status as overdue
24. Test `getStats()` — does NOT count `done` tasks as overdue even if `dueDate` is in the past
25. Test `update()` — updates specified fields on an existing task
26. Test `update()` — preserves fields not included in the update
27. Test `update()` — returns `null` for non-existent ID
28. Test `update()` — **catches the bug:** allows overwriting `id` and `createdAt` (no field protection)
29. Test `remove()` — returns `true` and removes the task on success
30. Test `remove()` — returns `false` for non-existent ID
31. Test `remove()` — task is gone from the store (not returned by `getAll()` or `findById()`)
32. Test `completeTask()` — sets `status` to `'done'` and `completedAt` to a valid ISO string
33. Test `completeTask()` — returns `null` for non-existent ID
34. Test `completeTask()` — **catches the bug:** silently resets `priority` to `'medium'` regardless of original value

### Unit Tests — `tests/validators.test.js`

35. Test `validateCreateTask()` — returns `null` for valid input with all fields
36. Test `validateCreateTask()` — returns `null` for input with only `title`
37. Test `validateCreateTask()` — returns error when `title` is missing
38. Test `validateCreateTask()` — returns error when `title` is empty string
39. Test `validateCreateTask()` — returns error when `title` is whitespace only
40. Test `validateCreateTask()` — returns error when `title` is not a string (number, boolean)
41. Test `validateCreateTask()` — returns `null` for each valid status (`todo`, `in_progress`, `done`)
42. Test `validateCreateTask()` — returns error for invalid status (`'pending'`, `'completed'`)
43. Test `validateCreateTask()` — returns `null` for each valid priority (`low`, `medium`, `high`)
44. Test `validateCreateTask()` — returns error for invalid priority
45. Test `validateCreateTask()` — returns `null` for valid ISO date `dueDate`
46. Test `validateCreateTask()` — returns error for invalid `dueDate`
47. Test `validateUpdateTask()` — returns `null` for empty body (no fields is valid for update)
48. Test `validateUpdateTask()` — returns error when `title` is present but empty string
49. Test `validateUpdateTask()` — returns error when `title` is present but whitespace only
50. Test `validateUpdateTask()` — allows `title` to be omitted entirely (unlike create)
51. Test `validateUpdateTask()` — returns error for invalid status
52. Test `validateUpdateTask()` — returns error for invalid priority
53. Test `validateUpdateTask()` — returns error for invalid `dueDate`

### Integration Tests — `tests/routes.test.js`

54. `GET /tasks` — returns 200 and empty array when no tasks exist
55. `GET /tasks` — returns 200 and all tasks after creating some
56. `GET /tasks?status=todo` — returns only tasks with that status
57. `GET /tasks?status=nonexistent` — returns empty array
58. `GET /tasks?page=1&limit=2` — returns correct paginated results
59. `GET /tasks?page=999` — returns empty array for out-of-range page
60. `POST /tasks` — returns 201 with the created task containing all expected fields
61. `POST /tasks` — returns 400 when `title` is missing
62. `POST /tasks` — returns 400 when `title` is empty string
63. `POST /tasks` — returns 400 for invalid `status`
64. `POST /tasks` — returns 400 for invalid `priority`
65. `POST /tasks` — returns 400 for invalid `dueDate`
66. `PUT /tasks/:id` — returns 200 with updated task
67. `PUT /tasks/:id` — returns 404 for non-existent ID
68. `PUT /tasks/:id` — returns 400 for invalid fields
69. `DELETE /tasks/:id` — returns 204 with no body
70. `DELETE /tasks/:id` — returns 404 for non-existent ID
71. `DELETE /tasks/:id` — task is actually removed (GET returns fewer results)
72. `PATCH /tasks/:id/complete` — returns 200 with `status: 'done'` and `completedAt` set
73. `PATCH /tasks/:id/complete` — returns 404 for non-existent ID
74. `GET /tasks/stats` — returns correct counts with no tasks
75. `GET /tasks/stats` — returns correct counts after creating tasks with various statuses
76. `GET /tasks/stats` — correctly identifies overdue tasks

---

## Bug Report

77. Create `BUG_REPORT.md` documenting all bugs found, each with:
    - What the expected behavior is
    - What actually happens
    - How you discovered it (which test)
    - Where in the code it lives (file + line)
    - What a fix looks like

78. **Bug 1 — `getByStatus()` substring matching:** `taskService.js:9` uses `t.status.includes(status)` instead of `t.status === status`. Filtering by `'in'` wrongly returns `'in_progress'` tasks.

79. **Bug 2 — `getPaginated()` off-by-one:** `taskService.js:12` calculates offset as `page * limit` instead of `(page - 1) * limit`. Page 1 skips all first-page results.

80. **Bug 3 — `completeTask()` resets priority:** `taskService.js:69` hard-codes `priority: 'medium'` in the update spread. A high-priority task silently becomes medium when completed.

81. **Bug 4 — `update()` no field protection:** `taskService.js:50` spreads the entire `fields` object, allowing clients to overwrite `id` and `createdAt` via PUT.

82. **Bug 5 — README vs code status mismatch:** README says `pending | in-progress | completed`, actual code uses `todo | in_progress | done`.

---

## Bug Fixes

83. Fix `getByStatus()` — change `.includes(status)` to `=== status` in `taskService.js:9`
84. Fix `getPaginated()` — change `page * limit` to `(page - 1) * limit` in `taskService.js:12`
85. Fix `completeTask()` — remove `priority: 'medium'` from the spread object in `taskService.js:69`
86. Update tests that were asserting buggy behavior to assert correct behavior

---

## New Feature: `PATCH /tasks/:id/assign`

87. Add `assignee: null` as a default field in `create()` function in `taskService.js`
88. Add `assignTask(id, assignee)` function in `taskService.js` — finds task by ID, sets `assignee`, returns updated task (or `null` if not found)
89. Export `assignTask` from `taskService.js`
90. Add `validateAssignTask(body)` function in `validators.js` — validates `assignee` is a required, non-empty string
91. Export `validateAssignTask` from `validators.js`
92. Add `PATCH /:id/assign` route handler in `routes/tasks.js` — validates input, calls `assignTask`, returns 400/404/200 appropriately
93. Import `validateAssignTask` in `routes/tasks.js`

### Tests for the Assign Feature

94. Unit test: `assignTask()` assigns a user to an existing task
95. Unit test: `assignTask()` returns `null` for non-existent task
96. Unit test: `assignTask()` overwrites a previously assigned user (re-assignment works)
97. Unit test: `validateAssignTask()` returns `null` for valid input
98. Unit test: `validateAssignTask()` returns error for missing `assignee`
99. Unit test: `validateAssignTask()` returns error for empty string `assignee`
100. Unit test: `validateAssignTask()` returns error for non-string `assignee`
101. Integration test: `PATCH /tasks/:id/assign` with valid body → 200, task has `assignee`
102. Integration test: `PATCH /tasks/:id/assign` with non-existent ID → 404
103. Integration test: `PATCH /tasks/:id/assign` with missing `assignee` → 400
104. Integration test: `PATCH /tasks/:id/assign` with empty string → 400
105. Integration test: `PATCH /tasks/:id/assign` on already-assigned task → 200, assignee updated
106. Integration test: assigned task persists — `GET /tasks` shows the assignee

---

## Coverage & Verification

107. Run `npm run coverage` and verify **80%+ coverage** across all `src/` files
108. Capture coverage summary output (screenshot or text)

---

## Submission Notes

109. Write a short note covering:
     - What you'd test next with more time
     - Anything that surprised you in the codebase
     - Questions you'd ask before shipping to production

---

## Submission

110. Commit all changes with meaningful commit messages
111. Push to a branch or fork
112. Share the link
