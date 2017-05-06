const { test, App } = require('../env');

const config = [
  {
    url: '/posts', method: 'POST',
    allow: { roles: ['client'] }
  },
  {
    url: '/posts', method: 'GET',
    allow: { roles: ['admin'] }
  },
  {
    url: '/posts/:id', method: 'GET',
    allow: { roles: ['client'] }
  }
];

test('should be allowed to read one post for client', async (t) => {
  const app = App(config, {}, { roles: ['client'] });
  const post = await app.post('/posts');
  const { error } = await app.get('/posts/' + post.body._id);

  t.falsy(error);
});

test('should be allowed to read many posts for admin', async (t) => {
  const app = App(config, {}, { roles: ['admin'] });
  const { error } = await app.get('/posts');

  t.falsy(error);
});

test('should be denied to read many posts for client', async (t) => {
  const app = App(config, {}, { roles: ['client'] });
  const { error } = await app.get('/posts');

  t.truthy(error);
});

test('should be denied to read one post for admin', async (t) => {
  const app = App(config, {}, { roles: ['admin'] });
  const post = await app.post('/posts');
  const { error } = await app.get('/posts/' + post.body._id);

  t.truthy(error);
});
