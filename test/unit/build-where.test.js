const test = require('ava');
const fn = require('../../src/rule-checker/rules/build-where');

const req = {
  params: { id: '1' },
  body: { some: '2' }
};

test('should replace values from req', (t) => {
  const expected = { _id: '1', any: '2' };
  const where = { _id: '{params.id}', any: '{body.some}' };
  const result = fn(where, req);
  t.deepEqual(result, expected);
});

test('should return path if value was not found', (t) => {
  const where = { _id: '{params.id}', any: '{body.some}' };
  const result = fn(where, {});
  t.deepEqual(result, where);
});
