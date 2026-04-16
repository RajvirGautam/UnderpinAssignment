# BUG REPORT

## Bug 1 — getByStatus() substring matching
- **Expected:** Only tasks with status exactly matching the query are returned.
- **Actual:** Tasks whose status contains the query as a substring are returned (e.g., 'in' matches 'in_progress').
- **Discovered by:** Test: getByStatus() — catches bug: substring match instead of exact
- **Location:** src/services/taskService.js, line 9
- **Fix:** Change `t.status.includes(status)` to `t.status === status`.

## Bug 2 — getPaginated() off-by-one
- **Expected:** Page 1 returns the first `limit` items, page 2 returns the next `limit`, etc.
- **Actual:** Page 1 skips all first-page results because offset is `page * limit` instead of `(page - 1) * limit`.
- **Discovered by:** Test: getPaginated() — catches bug: page 1 skips all first-page results (off-by-one)
- **Location:** src/services/taskService.js, line 12
- **Fix:** Change offset calculation from `page * limit` to `(page - 1) * limit`.
