// Type definitions for restify-router 0.5
// Project: https://github.com/ukayani/restify-router
// Definitions by: Otávio Araújo <https://github.com/otaviotech>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

// Some definitions were shallowed from Restify type definitions.
// See them in https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/restify

import { Server, RouteOptions, RequestHandlerType, RequestHandler } from "restify";

declare module 'restify-router' {

  interface Route {
    options: RouteOptions;
    handlers: RequestHandler[];
  }

  interface RouteCollection {
    get: Array<Route>;
    post: Array<Route>;
    put: Array<Route>;
    del: Array<Route>;
    patch: Array<Route>;
    head: Array<Route>;
    opts: Array<Route>;
  }

  export class Router {

    routes: RouteCollection;

    /**
     * Mounts a chain on the given path against this HTTP verb
     *
     * @param   opts if string, the URL to handle.
     *                                 if options, the URL to handle, at minimum.
     * @returns                the newly created route.
     */
    get(opts: string | RegExp | RouteOptions, ...handlers: RequestHandlerType[]): void;

    /**
     * Mounts a chain on the given path against this HTTP verb
     *
     * @param   opts if string, the URL to handle.
     *                                 if options, the URL to handle, at minimum.
     * @returns                the newly created route.
     */
    post(opts: string | RegExp | RouteOptions, ...handlers: RequestHandlerType[]): void;

    /**
     * Mounts a chain on the given path against this HTTP verb
     *
     * @param   opts if string, the URL to handle.
     *                                 if options, the URL to handle, at minimum.
     * @returns                the newly created route.
     */
    put(opts: string | RegExp | RouteOptions, ...handlers: RequestHandlerType[]): void;

    /**
     * Mounts a chain on the given path against this HTTP verb
     *
     * @param   opts if string, the URL to handle.
     *                                 if options, the URL to handle, at minimum.
     * @returns                the newly created route.
     */
    del(opts: string | RegExp | RouteOptions, ...handlers: RequestHandlerType[]): void;

    /**
     * Mounts a chain on the given path against this HTTP verb
     *
     * @param   opts if string, the URL to handle.
     *                                 if options, the URL to handle, at minimum.
     * @returns                the newly created route.
     */
    patch(opts: string | RegExp | RouteOptions, ...handlers: RequestHandlerType[]): void;

    /**
     * Mounts a chain on the given path against this HTTP verb
     *
     * @param   opts if string, the URL to handle.
     *                                 if options, the URL to handle, at minimum.
     * @returns                the newly created route.
     */
    head(opts: string | RegExp | RouteOptions, ...handlers: RequestHandlerType[]): void;

    /**
     * Mounts a chain on the given path against this HTTP verb
     *
     * @param   opts if string, the URL to handle.
     *                                 if options, the URL to handle, at minimum.
     * @returns                the newly created route.
     */
    opts(opts: string | RegExp | RouteOptions, ...handlers: RequestHandlerType[]): void;

    /**
     * Apply a list of common handlers to all routes registered on the router. All handlers will be prepended to
     * each route's handler list when applying to the server
     * @param handlers - can be a var-arg or list of handler functions
     */
    use(...handlers: RequestHandlerType[]): void;

    /**
     * Nest the routes defined in the given router under the given path
     *
     * @param path - String (must begin with a /)
     * @param router - a Router instance
     */
    add(path: String, router: Router): void;

    /**
     * Apply all routes from the router to the given restify server instance and adds an optional path prefix
     * @param server
     * @param prefix
     */
    applyRoutes(server: Server, prefix?: String): void;
  }
}
