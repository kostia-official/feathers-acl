const test = require('ava');
const lib = require('../../src');

test('should not create a middleware if no jwt', async (t) => {
  let called = false;
  const app = {
    use: () => called = true
  };
  lib({}).apply(app);
  t.falsy(called);
});

test('should create a middleware if jwt passed', async (t) => {
  let called = false;
  const app = {
    use: () => called = true
  };
  lib({}, { jwt: true }).apply(app);
  t.truthy(called);
});
