# feathers-acl

[![Build Status](https://travis-ci.org/kozzztya/feathers-acl.svg?branch=master)](https://travis-ci.org/kozzztya/feathers-acl)
[![Coverage Status](https://coveralls.io/repos/github/kozzztya/feathers-acl/badge.svg?branch=ci)](https://coveralls.io/github/kozzztya/feathers-acl?branch=ci)
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
    denyNotAllowed: true,             // deny all routes without "allow" rules
    adminRoles: ['admin'],            // allow all listed in config routes for this role
    baseUrl: 'http://localhost:8080', // need for owner rule
    jwt: {
      secret: 'blab',
      header: 'x-auth'                // Default is 'Authorization'
      options: {}                     // options for 'jsonwebtoken' lib
    }
  }));

module.exports = app;
```

## Config example

```
[
  {
    url: '/posts', method: 'GET',
    allow: { authenticated: false } // allow blog reading for everyone
  }, {
    url: '/posts', method: 'POST',
    allow: { roles: ['author'] }    // allow posts creating only for authors
  }, {
    url: '/posts/:id', method: 'PATCH',
    allow: { roles: ['author'], owner: { ownerField: 'authorId' } } // author can edit only own posts
  }, {
    url: '/posts', method: 'DELETE',
    allow: false // deny posts removing
  }, {
    url: '/users/:id', method: 'PATCH',
    allow: { self: true } // user can edit only own profile
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

Give access only for owner. Makes request to GET route and checks `ownerField`. First of all set:

```
app.configure(acl(config, { baseUrl: 'http://0.0.0.0:' + process.env.PORT }));
```

Then in config declare:

```
allow: {
  owner: { ownerField: 'authorId' }
}
```

`ownerField` - where do you store user id?
It gets user's id from `req.payload.userId`.

### Self

Give access only for own content. Compare user id and id from request.

```
allow: {
  self: { userIdPath: 'params.id' }
}
```

`userIdPath` - select path to value in middleware `req` object.

### Authenticated

You can manage authentication on your own, or set JWT options:

```
app.configure(acl(config, { jwt: { secret: 'blab', options } }));
```

And use it in ACL config:

```
allow: { authenticated: true }
```
