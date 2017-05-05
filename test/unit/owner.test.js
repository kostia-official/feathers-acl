const test = require('ava');
const _ = require('lodash');
const mongoose = require('mongoose');
const ownerRule = require('../../src/rule-checker/rules/owner');

mongoose.Promise = Promise;

const db = mongoose.createConnection('mongodb://localhost:27017/acl');
const schema = new mongoose.Schema({ userId: Number, usersIds: [Number] });
const Post = db.model('posts', schema);
const fn = ownerRule(db);

test('should be resolved for owner', async (t) => {
  const userId = 1;
  const post = await Post.create({ userId });
  const payload = { userId };
  const req = { params: { id: post._id } };
  const allow = { owner: { where: { _id: '{params.id}' }, model: 'posts', ownerField: 'userId' } };

  const res = await fn(payload, allow, req);
  t.truthy(res);
});

test('should be resolved for one of many owners', async (t) => {
  const userId = 1;
  const post = await Post.create({ usersIds: [userId, 2, 3] });
  const payload = { userId };
  const req = { params: { id: post._id } };
  const allow = { owner: { where: { _id: '{params.id}' }, model: 'posts', ownerField: 'usersIds' } };

  const res = await fn(payload, allow, req);
  t.truthy(res);
});

test('should be rejected for not owner', async (t) => {
  const post = await Post.create({ userId: 1 });
  const req = { params: { id: post._id } };
  const payload = { userId: 2 };
  const allow = { owner: { where: { _id: '{params.id}' }, model: 'posts', ownerField: 'userId' } };

  try {
    const res = await fn(payload, allow, req);
    t.falsy(res);
  } catch (err) {
    t.is(err.status, 403);
    t.is(err.message, 'No permissions.');
  }
});

test('should be rejected if no userId field', async (t) => {
  const payload = {};
  const allow = { owner: { model: 'posts', ownerField: 'userId' } };

  try {
    const res = await fn(payload, allow);
    t.falsy(res);
  } catch (err) {
    t.is(err.status, 403);
    t.is(err.message, 'No user id.');
  }
});

test('should be resolved if no rule', async (t) => {
  const payload = { userId: 2 };
  const allow = {};

  const res = await fn(payload, allow);
  t.truthy(res);
});

test('should not be status for other errors', async (t) => {
  const payload = { userId: 2 };
  const allow = { owner: { model: '1', ownerField: 'userId' } };

  try {
    const res = await fn(payload, allow);
    t.falsy(res);
  } catch (err) {
    t.falsy(err.status);
    t.truthy(err);
  }
});

test('should be 500 for wrong where', async (t) => {
  const payload = { userId: 2 };
  const allow = { owner: { where: { any: 132 }, model: 'posts', ownerField: 'userId' } };

  try {
    const res = await fn(payload, allow);
    t.falsy(res);
  } catch (err) {
    t.is(err.status, 500);
    t.truthy(_.includes(err.message, 'Wrong where'));
  }
});

test('should be 500 if no mongoose connection', async (t) => {
  const userId = 1;
  const post = await Post.create({ usersIds: [userId, 2, 3] });
  const payload = { userId };
  const req = { params: { id: post._id } };
  const allow = { owner: { where: { _id: '{params.id}' }, model: 'posts', ownerField: 'usersIds' } };

  try {
    const res = await ownerRule()(payload, allow, req);
    t.falsy(res);
  } catch (err) {
    t.is(err.status, 500);
    t.truthy(_.includes(err.message, 'No mongoose connection.'));
  }
});
