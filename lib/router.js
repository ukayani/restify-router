'use strict';
const assert = require('assert-plus');
const concat = require('./path').concat;

/**
 * Given a argument list, flatten the list
 * @param args
 * @param start point from which to slice the list
 * @returns {Array}
 */
function getHandlersFromArgs (args, start) {
    assert.ok(args);

    args = Array.prototype.slice.call(args, start);

    function process (handlers, acc) {
        if (handlers.length === 0) {
            return acc;
        }

        var head = handlers.shift();
        if (Array.isArray(head)) {
            return process(head.concat(handlers), acc);
        } else {
            assert.func(head, 'handler');
            acc.push(head);
            return process(handlers, acc);
        }
    }

    return process(args, []);
}

const RESTIFY_METHODS = ['get', 'post', 'put', 'del', 'patch', 'head', 'opts'];

/**
 * Simple router that aggregates restify routes
 */
function Router () {

    // Routes with all verbs
    const routes = {};
    RESTIFY_METHODS.forEach(function (method) {
        routes[method] = [];
    });

    this.routes = routes;
    this.commonHandlers = [];
    this.routers = [];
}

/**
 * Create a method on the router for each http method/verb
 */
RESTIFY_METHODS.forEach(function (method) {
    Router.prototype[method] = function (options) {
        let opts = options;

        // check if a string or regex was passed in for the path instead of an object
        if (opts instanceof RegExp || typeof opts === 'string') {
            opts = {
                path: opts
            };
        } else if (typeof opts === 'object') {
            opts = Object.assign({}, opts); // shallow copy
        } else {
            throw new TypeError('path (string) required');
        }

        if (arguments.length < 2) {
            throw new TypeError('handler (function) required');
        }

        const route = {
            options: opts,
            handlers: getHandlersFromArgs(arguments, 1)
        };

        this.routes[method].push(route);
    };

});

/**
 * Apply a list of common handlers to all routes registered on the router. All handlers will be prepended to
 * each route's handler list when applying to the server
 * @param handlers - can be a var-arg or list of handler functions
 */
Router.prototype.use = function () {
    this.commonHandlers = this.commonHandlers.concat(getHandlersFromArgs(arguments, 0));
};

/**
 * Nest the routes defined in the given router under the given path
 *
 * @param path - String (must begin with a /)
 * @param router - a Router instance
 */
Router.prototype.add = function (path, router) {

    if (typeof path !== 'string' && !(path instanceof RegExp)) {
        throw new TypeError('path (string|regexp) required');
    }

    if (!(router instanceof Router)) {
        throw new TypeError('router (Router) required');
    }

    this.routers.push({path: path, router: router});
};

/**
 * Apply all routes from the router to the given restify server instance and adds an optional path prefix
 * @param server
 * @param prefix
 */
Router.prototype.applyRoutes = function (server, prefix) {
    const methods = Object.keys(this.routes);
    const self = this;
    prefix = prefix || '';

    methods.forEach(function (method) {
        if (self.routes[method].length === 0) {
            return;
        }

        self.routes[method].forEach(function (route) {

            const options = Object.assign({}, route.options);

            options.path = concat(prefix, options.path);

            server.log.info('Registering %s at uri %s', method.toUpperCase(), options.path);
            server[method](options, self.commonHandlers.concat(route.handlers));
        });
    }
    );

    this.routers.forEach(function (r) {
        const router = r.router;
        const path = concat(prefix, r.path);
        // Prepend commonHandlers before nested router's handlers
        router.commonHandlers = self.commonHandlers.concat(router.commonHandlers);
        router.applyRoutes(server, path);
    });
};

module.exports = Router;
