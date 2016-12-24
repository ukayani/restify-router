# Restify Router

[![Build Status](https://travis-ci.org/ukayani/restify-router.svg?branch=master)](https://travis-ci.org/ukayani/restify-router)

This module allows you to define your routes using a Router interface that is identical to how routes are registered
on a restify server. You can then apply the routes to a server instance.

Borrowing from the idea of Express router where you can organize routes by creating multiple routers and applying them
to an express server, this component allows you to achieve a similar separation/grouping of route definitions.

# Installation

```bash
$ npm install --save restify-router
```

## Creating a router

A router object is an isolated instance of routes. The router interface matches the interface for adding routes to a
restify server:

```javascript
var Router = require('restify-router').Router;
var routerInstance = new  Router();
var restify = require('restify');

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

// add a route like you would on a restify server instance
routerInstance.get('/hello/:name', respond);

var server = restify.createServer();
// add all routes registered in the router to this server instance
routerInstance.applyRoutes(server);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
```

## Why use it?

When your application starts to contain a lot of routes, you may want to group the definition of routes in
separate files rather than registering every route in a single server bootstrap/creation file.

For example, if we have two sets of routes in our application:

Users:

- GET `/users`
- GET `/users/:id`

Posts:

- GET `/posts`
- GET `/posts/:id`

```javascript
var userRouter = require('./user.router'); // return a Router with only user route definitions
var postsRouter = require('./posts.router'); // return a Router with only posts route definitions

var restify = require('restify');
var server = restify.createServer();

// add user routes
userRouter.applyRoutes(server);

// add posts routes
postsRouter.applyRoutes(server);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
```

# Prefixing Routes

To prefix all routes, specify the prefix as the second argument to `router.applyRoutes(server, prefix)`

Example:

Routes:

- GET `/admin/settings`
- GET `/admin/controls`


```javascript
var Router = require('restify-router').Router;
var restify = require('restify');

function settings(req, res, next) {
  res.send('settings');
  next();
}

function controls(req, res, next) {
  res.send('controls');
  next();
}

var routerInstance = new Router();

// add a route like you would on a restify server instance
routerInstance.get('/settings', settings);
routerInstance.get('/controls', controls);

var server = restify.createServer();
// add all routes registered in the router to this server instance with uri prefix 'admin'
routerInstance.applyRoutes(server, '/admin');

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});

```

# Common Middleware

There may be times when you want to apply some common middleware to all routes registered with a router.
For example, you may want some common authorization middleware for all routes under a specific router.

All middleware registered via `.use` will be applied before route level middleware.

To stay consistent with the `restify` server interface, the method on the Router is:

- `.use(middlewareFn, middlewareFn2, ...)`
- `.use([middlewareFn, middlewareFn2, ...])`

**Note**: Multiple calls to `.use` will result in aggregation of middleware, each successive call will append to the list of common middleware

## Example Usage

```javascript
var router = new Router();

// this will run before every route on this router
router.use(function (req, res, next) {
   if (req.query.role === 'admin') {
    return next();
   } else {
    return next(new errors.UnauthorizedError());
   }
});

router.get('/hello', function (req, res, next) {
   res.send('Hello');
   next();
});

router.get('/test', function (req, res, next) {
   res.send('Test');
   next();
});

router.applyRoutes(server);

// calling GET /hello  runs use middle ware first and then the routes middleware

```
