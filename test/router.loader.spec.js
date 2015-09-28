'use strict';
var restify = require('restify');
var chai = require('chai');
var should = chai.should();
var expect = chai.expect;
var request = require('supertest');
var loader = require('../lib/router.loader');

describe('Restify Router Loader', function () {

  var server;

  beforeEach(function () {

    server = restify.createServer();
    server.use(restify.queryParser());
    server.use(restify.acceptParser(server.acceptable));
    server.use(restify.bodyParser());

  });

  it('Should load routes recursively from route folder', function (done) {

    loader.loadSync(__dirname + '/routes', function (err, routers) {

      routers.length.should.equal(2);

      routers.forEach(function each(router) {
        router.applyRoutes(server);
      });
    });

    function next() {
      request(server)
        .get('/hello')
        .expect(200)
        .expect('"hello"', done);
    }

    request(server)
      .get('/test')
      .expect(200)
      .expect('"test"', next);

  });

  it('Should return an err if folder doesnt exist', function () {

    loader.loadSync('teststetst', function (err, routers) {
      var test = err === null;
      /* jshint ignore:start */
      test.should.be.false;
      /* jshint ignore:end */
    });

  });

  afterEach(function () {
    server.close();
  });

});
