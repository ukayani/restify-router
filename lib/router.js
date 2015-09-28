'use strict';
var assert = require('assert-plus');
var _ = require('lodash');

/**
 * Given a argument list, flatten the list
 * @param args
 * @param start point from which to slice the list
 * @returns {Array}
 */
function getHandlersFromArgs(args, start) {
  assert.ok(args);

  args = Array.prototype.slice.call(args, start);

  var chain = [];
  var flattenedArgs = _.flatten(args, true);

  flattenedArgs.forEach(function (handler) {
    assert.func(handler, 'handler');
    chain.push(handler);
  });

  return chain;
}

var methods = ['get', 'post', 'put', 'del', 'patch', 'head', 'opts'];

/**
 * Simple router that aggregates restify routes
 */
function Router() {

  // Routes with all verbs
  var routes = {};
  methods.forEach(function (method) {
    routes[method] = [];
  });

  this.routes = routes;
}

/**
 * Create a method on the router for each http method/verb
 */
methods.forEach(function (method) {
  Router.prototype[method] = function (options) {
    var opts = options;

    // check if a string or regex was passed in for the path instead of an object
    if (opts instanceof RegExp || typeof opts === 'string') {
      opts = {
        path: opts
      };
    } else if (typeof opts === 'object') {
      opts = _.defaults({}, opts); // shallow copy
    } else {
      throw new TypeError('path (string) required');
    }

    if (arguments.length < 2) {
      throw new TypeError('handler (function) required');
    }

    var route = {
      options: opts,
      handlers: getHandlersFromArgs(arguments, 1)
    };

    this.routes[method].push(route);
  };

});

/**
 * Apply all routes from the router to the given restify server instance
 * @param server
 */
Router.prototype.applyRoutes = function (server) {
  var methods = Object.keys(this.routes);
  var self = this;

  methods.forEach(function (method) {
      if (self.routes[method].length === 0) {
        return;
      }

      self.routes[method].forEach(function (route) {
        server.log.info('Registering %s at uri %s', method.toUpperCase(), route.options.path);
        server[method](route.options, route.handlers);
      });
    }
  );
};

module.exports = Router;
