const test = require('ava');
const lib = require('../../src');
const Supertest = require('supertest');
const express = require('express');

const app = express();

test('should work for express', async (t) => {
  const config = [{ url: '/blog', method: 'GET', allow: {} }];
  const options = { denyNotAllowed: true };

  lib(config, options)(app);
  app.get('/blog', (req, res) => {
    res.send({ message: 'hi' });
  });

  app.get('/secret', (req, res) => {
    res.send({ message: 'secret' });
  });

  const supertest = Supertest(app);

  const { error: getBlogError } = await supertest.get('/blog');
  t.falsy(getBlogError);

  const { error: getSecretError } = await supertest.get('/secret');
  t.truthy(getSecretError);
});
