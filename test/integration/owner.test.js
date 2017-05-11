const { test, App } = require('../env');

const userId = '5901af327b35960019ee8b2e';
const config = [{
  url: '/posts', method: 'POST',
  allow: {}
}, {
  url: '/posts/:id', method: 'GET',
  allow: { owner: { ownerField: 'userId' } }
}];

test('should be no error for owner', async (t) => {
  const app = App(config, {}, { userId });
  const post = await app.post('/posts').send({ userId });
  const { error } = await app.get('/posts/' + post.body._id);

  t.falsy(error);
});

test('should be resolved for one of many owners', async (t) => {
  const config = [{
    url: '/posts', method: 'POST',
    allow: {}
  }, {
    url: '/posts/:id', method: 'GET',
    allow: { owner: { ownerField: 'usersIds' } }
  }];
  const app = App(config, {}, { userId });
  const post = await app.post('/posts').send({ usersIds: [userId, '2', '3'] });
  const { error } = await app.get('/posts/' + post.body._id);

  t.falsy(error);
});

test('should be rejected for not owner', async (t) => {
  const app = App(config, {}, { userId: '2' });
  const post = await app.post('/posts').send({ userId });
  const { error } = await app.get('/posts/' + post.body._id);

  t.is(error.status, 403);
  t.is(error.text, 'No permissions.');
});

test('should be rejected if no userId field', async (t) => {
  const app = App(config, {}, {});
  const post = await app.post('/posts').send({ userId });
  const { error } = await app.get('/posts/' + post.body._id);

  t.is(error.status, 403);
  t.is(error.text, 'No user id.');
});

test('should be resolved if no rule', async (t) => {
  const config = [
    { url: '/posts', method: 'POST', allow: {} },
    { url: '/posts/:id', method: 'GET', allow: {} }
  ];
  const app = App(config, {}, {});
  const post = await app.post('/posts').send({ userId });
  const { error } = await app.get('/posts/' + post.body._id);

  t.falsy(error);
});
