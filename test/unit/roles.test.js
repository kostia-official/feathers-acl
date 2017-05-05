const test = require('ava');
const fn = require('../../src/rule-checker/rules/roles')();

test.cb('should be resolve with proper role', (t) => {
  const rule = { roles: ['admin'] };
  const payload = { roles: ['admin'] };

  fn(payload, rule).then(() => t.end());
});

test.cb('should resolve with one proper role of many', (t) => {
  const rule = { roles: ['admin', 'client'] };
  const payload = { roles: ['admin'] };

  fn(payload, rule).then(() => t.end());
});

test.cb('should be true without role rule', (t) => {
  fn(null, null).then(() => t.end());
});

test.cb('should throw error with wrong role', (t) => {
  const rule = { roles: ['admin', 'stuff'] };
  const payload = { roles: ['intruder'] };

  fn(payload, rule).catch(() => t.end());
});

test.cb('should throw error with null payload', (t) => {
  const rule = { roles: ['admin'] };
  fn(null, rule).catch(() => t.end());
});

test.cb('should throw error with empty roles rule', (t) => {
  const rule = { roles: [] };
  fn(null, rule).catch(() => t.end());
});
