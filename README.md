[![Build Status](https://travis-ci.org/kozzztya/feathers-acl.svg?branch=master)](https://travis-ci.org/kozzztya/feathers-acl)
[![Coverage Status](https://coveralls.io/repos/github/kozzztya/feathers-acl/badge.svg?branch=ci)](https://coveralls.io/github/kozzztya/feathers-acl?branch=ci)

# feathers-acl

[![Greenkeeper badge](https://badges.greenkeeper.io/kozzztya/feathers-acl.svg)](https://greenkeeper.io/)

Declarative ACL for Feathers and Express apps.

## Configuration

```js
const feathers = require('feathers');
const rest = require('feathers-rest');
const acl = require('feathers-acl');
const services = require('./services');
const customFields = require('./validation-fields');
const db = require('./db');
const aclConfig = JSON.parse(process.env.ACL);

const app = feathers();
app.configure(rest())
  .configure(services)
  .configure(acl(aclConfig, {
    denyNotAllowed: true,   // deny all routes without "allow" rules
    mongooseConnection: db, // need for owner rule
    jwt: {
      secret: 'blab',
      header: 'x-auth'      // Default is 'Authorization'
      options: {}           // options for 'jsonwebtoken' lib
    }
  }));

module.exports = app;
```

## Config example

```
[
  {
    url: '/posts', method: 'GET',
    allow: { authenticated: false }
  }, {
    url: '/posts', method: 'POST',
    allow: { authenticated: true, roles: ['client', 'admin'] }
  }, {
    url: '/posts/:id', method: 'PATCH',
    allow: {
      authenticated: true, roles: ['admin'],
      owner: { where: { _id: '{params.id}', model: 'posts', ownerField: 'author' } }
    }
  }, {
    url: '/posts', method: 'DELETE',
    allow: { roles: [] } // deny access
  }
]
```

## Rules

Rules should be declared in `allow` object.

### Roles

Set what roles are allowed.

```
allow: { roles: ['client', 'admin'] }
```

It gets user's role from `req.payload.roles` array.

### Owner

Give access only for MongoDB document creator. First of all set:

```
app.configure(acl(config, { mongooseConnection: db }));
```

Then in config declare:

```
allow: {
  owner: {
    where: { _id: '{params.id}' },
    model: 'posts',
    ownerField: 'author'
  }
}
```

`where` - how to find needed document. Set in {} path to needed values in `req` object. Default is `{ _id: '{params.id}' }`.
`model` - mongoose model. By default can be got from route url. For example `posts` on `/posts`.
`ownerField` - where you store user id?

It gets user's id from `req.payload.userId`.

### Authenticated

You can manage authentication on your own, or set JWT options:

```
app.configure(acl(config, { jwt: { secret: 'blab', options } }));
```

And use it in ACL config:

```
allow: { authenticated: true }
```
