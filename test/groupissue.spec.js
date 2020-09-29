'use strict';
var restify = require('restify');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var request = require('supertest');
var Router = require('../lib/router');

describe('Restify Router // group Issues', function () {

  var server;

  beforeEach(function () {

    server = restify.createServer();
    server.use(restify.queryParser());
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.bodyParser());

  });

  describe('Several groups at same level', function () {
    it('Should allow more than one group at same level', function (done) {
      var router = new Router();

      router.group('/v1', function (router) {
        router.group('/auth', function (router) {
          router.post('/register', function (req, res, next) {});
        });
        router.group('/user', function (router) {
          router.get('/info', function (req, res, next) {
            res.send({
              status: 'success',
              name: 'username'
            });
            return next();
          });
        });
      });

      router.applyRoutes(server);

      request(server)
        .get('/v1/user/info')
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          res.body.should.deep.equal({
            status: 'success',
            name: 'username'
          });
          done();
        });
    });
  });

  describe('Middlewares with two groups at same level', function () {
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
        router.group('/auth', second, third, function (router) {
          router.post('/register', function (req, res, next) {});
        });
        router.group('/user', second, third, function (router) {
          router.get('/info', function (req, res, next) {
            res.send({
              status: 'success',
              commonHandlerInjectedValues: req.test
            });
            return next();
          });
        });
      });

      router.applyRoutes(server);

      request(server)
        .get('/v1/user/info')
        .expect(200)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }

          res.body.should.deep.equal({
            status: 'success',
            commonHandlerInjectedValues: [1, 2, 3]
          });
          done();
        });
    });
  });

  afterEach(function () {
    server.close();
  });
});
