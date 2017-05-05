const { test, App } = require('../env');

const config = [{
  url: '/posts/:id', method: 'GET',
  allow: {
    owner: { where: { _id: '{params.id}' }, model: 'posts', ownerField: 'userId' },
    roles: ['admin']
  }
}];
const userId = '5901af327b35960019ee8b2e';

test('should be allowed for all rules', async (t) => {
  const app = App(config, {}, { roles: ['admin'], userId });
  const post = await app.post('/posts').send({ userId });
  const { error } = await app.get('/posts/' + post.body._id);

  t.falsy(error);
});

test('should be denied because of role', async (t) => {
  const app = App(config, {}, { roles: ['guest'], userId });
  const post = await app.post('/posts').send({ userId });
  const { error } = await app.get('/posts/' + post.body._id);

  t.is(error.text, 'Wrong roles: guest');
  t.is(error.status, 403);
});

test('should be denied because of owner', async (t) => {
  const app = App(config, {}, { roles: ['admin'], userId });
  const post = await app.post('/posts').send();
  const { error } = await app.get('/posts/' + post.body._id);

  t.is(error.text, 'No permissions.');
  t.is(error.status, 403);
});
