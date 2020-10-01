'use strict';
var restify = require('restify');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var request = require('supertest');
var Router = require('../lib/router');

describe('Restify Router', function () {

  var server;

  beforeEach(function () {

    server = restify.createServer();
    server.use(restify.queryParser());
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.bodyParser());

  });

  describe('Simple unnamed routes', function () {
    it('Should add simple GET route to server', function (done) {

      var router = new Router();

      router.get('/hello', function (req, res, next) {
        res.send('Hello World');
        next();
      });

      router.applyRoutes(server);

      request(server)
        .get('/hello')
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          res.body.should.equal('Hello World');
          done();
        });

    });

    it('Should add simple GET route with prefix to server', function (done) {

      var router = new Router();

      router.get('/world', function (req, res, next) {
        res.send('Hello World');
        next();
      });

      router.applyRoutes(server, '/hello');

      request(server)
        .get('/hello/world')
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          res.body.should.equal('Hello World');
          done();
        });

    });

    it('Should add simple regex GET route to server', function (done) {

      var router = new Router();

      router.get(/^\/([a-zA-Z0-9_\.~-]+)\/(.*)/, function (req, res, next) {
        res.send(req.params[0] + '-' + req.params[1]);
        next();
      });

      router.applyRoutes(server);

      request(server)
        .get('/hello/test')
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          res.body.should.equal('hello-test');
          done();
        });

    });

    it('Should add simple regex GET route to server with prefix', function (done) {

      var router = new Router();

      router.get(/^\/foo+/, function (req, res, next) {
        res.send(200);
        next();
      });

      router.applyRoutes(server, '/test');

      request(server)
        .get('/test/foooo')
        .expect(200)
        .end(function (err) {
          if (err) {
            return done(err);
          }
          done();
        });

    });

    it('Should add simple regex GET route to server with regex prefix', function (done) {

      var router = new Router();

      router.get(/^\/ba+r/, function (req, res, next) {
        res.send(200);
        next();
      });

      router.applyRoutes(server, /\/foo+/);

      request(server)
        .get('/foooo/baaaar')
        .expect(200)
        .end(function (err) {
          if (err) {
            return done(err);
          }
          done();
        });

    });

    it('Should add simple POST route to server', function (done) {

      var router = new Router();

      router.post('/postme', function (req, res, next) {
        res.send(req.body.name);
        next();
      });

      router.applyRoutes(server);

      request(server)
        .post('/postme')
        .set('Content-Type', 'application/json')
        .send({name: 'test'})
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          res.body.should.equal('test');
          done();
        });

    });

    it('Should add simple PUT route to server', function (done) {
      var router = new Router();

      router.put('/puttme', function (req, res, next) {
        res.send(req.body.name);
        next();
      });

      router.applyRoutes(server);

      request(server)
        .put('/puttme')
        .set('Content-Type', 'application/json')
        .send({name: 'test'})
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          res.body.should.equal('test');
          done();
        });

    });

    it('Should add simple DELETE route to server', function (done) {
      var router = new Router();

      router.del('/deleteme/:id', function (req, res, next) {
        res.send(req.params.id);
        next();
      });

      router.applyRoutes(server);

      request(server)
        .del('/deleteme/2')
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          res.body.should.equal('2');
          done();
        });

    });

    it('Should add simple PATCH route to server', function (done) {
      var router = new Router();

      router.patch('/patchme', function (req, res, next) {
        res.send(req.body.name);
        next();
      });

      router.applyRoutes(server);

      request(server)
        .patch('/patchme')
        .set('Content-Type', 'application/json')
        .send({name: 'test'})
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          res.body.should.equal('test');
          done();
        });

    });

    it('Should add simple HEAD route to server', function (done) {
      var router = new Router();

      router.head('/head', function (req, res, next) {
        res.header('x-test', 'testing');
        res.send(200);
        next();
      });

      router.applyRoutes(server);

      request(server)
        .head('/head')
        .expect(200)
        .expect('x-test', 'testing')
        .end(done);

    });

    it('Should add simple OPTIONS route to server', function (done) {
      var router = new Router();

      router.opts('/opts', function (req, res, next) {
        res.header('Allow', 'GET,POST,OPTIONS');
        res.send(200);
        next();
      });

      router.applyRoutes(server);

      request(server)
        .options('/opts')
        .expect(200)
        .expect('Allow', 'GET,POST,OPTIONS')
        .end(done);
    });

  });

  describe('Complex route definitions', function () {

    it('Should add a named route', function (done) {
      var router = new Router();

      router.get({
        name: 'hello',
        path: '/hello'
      }, function (req, res, next) {
        res.send('Hello World');
        next();
      });

      router.applyRoutes(server);

      request(server)
        .get('/hello')
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          res.body.should.equal('Hello World');
          done();
        });

    });

    it('Should add versioned routes', function (done) {
      var router = new Router();

      router.get({
        path: '/hello',
        version: '1.0.0'
      }, function (req, res, next) {
        res.send('1.0.0');
        next();
      });

      router.get({
        path: '/hello',
        version: '2.0.0'
      }, function (req, res, next) {
        res.send('2.0.0');
        next();
      });

      router.applyRoutes(server);

      request(server)
        .get('/hello')
        .set('Accept-Version', '~2')
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          res.body.should.equal('2.0.0');
          done();
        });

    });

  });

  describe('Common middleware via .use', function () {

    it('Should allow var-arg passing of middleware', function (done) {
      var router = new Router();

      var first = function (req, res, next) {
        req.test = [1];
        next();
      };

      var second = function (req, res, next) {
        req.test.push(2);
        next();
      };

      router.get('/foo', function (req, res, next) {
        res.send(req.test);
        next();
      });

      router.get('/bar', function (req, res, next) {
        res.send(req.test);
        next();
      });

      router.use(first, second);

      router.applyRoutes(server);

      request(server)
        .get('/foo')
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          res.body.should.deep.equal([1, 2]);

          // check /bar, should have the same response
          // TODO(uk): switch to supertest-as-promised to avoid nested callbacks
          request(server)
            .get('/bar')
            .expect(200)
            .end(function (err, res) {
              if (err) {
                return done(err);
              }

              res.body.should.deep.equal([1, 2]);
              done();
            });

        });

    });

    it('Should allow aggregation of middlewares via multiple calls to .use', function (done) {
      var router = new Router();

      var first = function (req, res, next) {
        req.test = [1];
        next();
      };

      var second = function (req, res, next) {
        req.test.push(2);
        next();
      };

      router.get('/foo', function (req, res, next) {
        res.send(req.test);
        next();
      });

      router.use(first);
      router.use(second);

      router.applyRoutes(server);

      request(server)
        .get('/foo')
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
          res.body.should.deep.equal([1, 2]);
          done();
        });

    });

  });

  describe('Nested routers via .add', function () {
    it('Should allow arbitrary nesting of routers', function (done) {
      var v1 = new Router();
      var auth = new Router();
      var register = new Router();

      register.post('/register', function (req, res, next) {
        res.send({
          status: 'success',
          name: req.body.name
        });
        return next();
      });

      auth.add('/auth', register);
      v1.add('/v1', auth);

      v1.applyRoutes(server);

      request(server)
        .post('/v1/auth/register')
        .set('Content-Type', 'application/json')
        .send({name: 'test'})
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          res.body.should.deep.equal({
            status: 'success',
            name: 'test'
          });
          done();
        });

    });

    it('Should allow nesting routers using regex paths', function (done) {
      var foo = new Router();
      var bar = new Router();
      var bam = new Router();

      bam.get('/bam', function (req, res, next) {
        res.send(200);
        return next();
      });

      bar.add(/^\/ba+r/, bam);
      foo.add(/^\/foo+/, bar);

      foo.applyRoutes(server);

      request(server)
        .get('/fooo/baar/bam')
        .expect(200)
        .end(function (err) {
          if (err) {
            return done(err);
          }
          done();
        });

    });

    it('Should fail if invalid path type is provided for router', function () {

      function fail() {
        var router = new Router();
        var nested = new Router();

        router.add({}, nested);
      }

      /* jshint ignore:start */
      expect(fail).to.throw('path (string|regexp) required');
      /* jshint ignore:end */
    });

    it('Should fail if router object specified is not of type Router', function () {

      function fail() {
        var router = new Router();

        router.add('/foo', function (req, res, next) {
        });
      }

      /* jshint ignore:start */
      expect(fail).to.throw('router (Router) required');
      /* jshint ignore:end */
    });

  });

  describe('Nested routers via .add should process middlewares in order', function () {
    it('Should process middlewares in order', function (done) {
      var v1 = new Router();
      var auth = new Router();
      var register = new Router();

      var first = function (req, res, next) {
        if (req.test && req.test.constructor === Array) {
          req.test.push(1);
        } else {
          req.test = [1];
        }
        next();
      };

      var second = function (req, res, next) {
        req.test.push(2);
        next();
      };

      var third = function (req, res, next) {
        req.test.push(3);
        next();
      };

      register.post('/register', function (req, res, next) {
        res.send({
          status: 'success',
          name: req.body.name,
          commonHandlerInjectedValues: req.test
        });
        return next();
      });

      auth.use(second, third);
      auth.add('/auth', register);
      v1.use(first);
      v1.add('/v1', auth);

      v1.applyRoutes(server);

      request(server)
        .post('/v1/auth/register')
        .set('Content-Type', 'application/json')
        .send({name: 'test'})
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          res.body.should.deep.equal({
            status: 'success',
            name: 'test',
            commonHandlerInjectedValues: [1, 2, 3]
          });
          done();
        });

    });
  });

  describe('Nested routers via .group', function () {
    it('Should allow arbitrary nesting of routers', function (done) {
      var router = new Router();

      router.group('/v1', function (router) {
        router.group('/somethingelse', function (router) {})
        router.group('/auth', function (router) {
          router.post('/register', function (req, res, next) {
            res.send({
              status: 'success',
              name: req.body.name
            });
            return next();
          });
        });
      });

      router.applyRoutes(server);

      request(server)
        .post('/v1/auth/register')
        .set('Content-Type', 'application/json')
        .send({name: 'test'})
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          res.body.should.deep.equal({
            status: 'success',
            name: 'test'
          });
          done();
        });

    });

    it('Should allow nesting routers using regex paths', function (done) {
      var router = new Router();

      router.group(/^\/foo+/, function (router) {
        router.group(/^\/ba+r/, function (router) {
          router.get('/bam', function (req, res, next) {
            res.send(200);
            return next();
          });
        });
      });

      router.applyRoutes(server);

      request(server)
        .get('/fooo/baar/bam')
        .expect(200)
        .end(function (err) {
          if (err) {
            return done(err);
          }
          done();
        });

    });

    it('Should fail if invalid path type is provided for router', function () {

      function fail() {
        var router = new Router();

        router.group({}, function (router) {
          router.get('/bam', function (req, res, next) {
            res.send(200);
            return next();
          });
        });
      }

      /* jshint ignore:start */
      expect(fail).to.throw('group (path) required');
      /* jshint ignore:end */
    });
  });

  describe('Nested routers via .group should process middlewares in order', function () {
    it('Should process middlewares in order', function (done) {
      var router = new Router();

      var first = function (req, res, next) {
        if (req.test && req.test.constructor === Array) {
          req.test.push(1);
        } else {
          req.test = [1];
        }
        next();
      };

      var second = function (req, res, next) {
        req.test.push(2);
        next();
      };

      var third = function (req, res, next) {
        req.test.push(3);
        next();
      };

      router.group('/v1', first, function (router) {
        router.group('/somethingelse', function (router) {})
        router.group('/auth', second, third, function (router) {
          router.post('/register', function (req, res, next) {
            res.send({
              status: 'success',
              name: req.body.name,
              commonHandlerInjectedValues: req.test
            });
            return next();
          });
        });
      });

      router.applyRoutes(server);

      request(server)
        .post('/v1/auth/register')
        .set('Content-Type', 'application/json')
        .send({name: 'test'})
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          res.body.should.deep.equal({
            status: 'success',
            name: 'test',
            commonHandlerInjectedValues: [1, 2, 3]
          });
          done();
        });

    });

    it('Should process middlewares with common middleware in order', function (done) {
      var router = new Router();

      var common = function (req, res, next) {
        if (req.test && req.test.constructor === Array) {
          req.test.push(0);
        } else {
          req.test = [0];
        }
        next();
      };

      var first = function (req, res, next) {
        if (req.test && req.test.constructor === Array) {
          req.test.push(1);
        } else {
          req.test = [1];
        }
        next();
      };

      var second = function (req, res, next) {
        req.test.push(2);
        next();
      };

      var third = function (req, res, next) {
        req.test.push(3);
        next();
      };

      router.use(common);

      router.group('/v1', first, function (router) {
        router.group('/auth', second, third, function (router) {
          router.post('/register', function (req, res, next) {
            res.send({
              status: 'success',
              name: req.body.name,
              commonHandlerInjectedValues: req.test
            });
            return next();
          });
        });
      });

      router.applyRoutes(server);

      request(server)
        .post('/v1/auth/register')
        .set('Content-Type', 'application/json')
        .send({name: 'test'})
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          res.body.should.deep.equal({
            status: 'success',
            name: 'test',
            commonHandlerInjectedValues: [0, 1, 2, 3]
          });
          done();
        });

    });
  });

  describe('Common failure cases', function () {

    it('Should fail if invalid path type is provided', function () {

      function fail() {
        var router = new Router();

        router.get(true, function (req, res, next) {
          //fails
          res.send(200);
        });
      }

      /* jshint ignore:start */
      expect(fail).to.throw('path (string) required');
      /* jshint ignore:end */
    });

    it('Should fail if no handler is provided', function () {

      function fail() {
        var router = new Router();

        router.get('test');
      }

      /* jshint ignore:start */
      expect(fail).to.throw('handler (function) required');
      /* jshint ignore:end */
    });

  });

  afterEach(function () {
    server.close();
  });
});
