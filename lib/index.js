'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.routerEnhancerMiddleware = exports.configure = exports.addModule = exports.PageSwitch = exports.ROUTE = exports.PREFIX = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /**
                                                                                                                                                                                                                                                                               * Created by rouven on 07.07.17.
                                                                                                                                                                                                                                                                               */

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _findInObject = require('find-in-object');

var _findInObject2 = _interopRequireDefault(_findInObject);

var _pathToRegexp = require('path-to-regexp');

var _routerEnhancerMiddleware = require('./middlewares/routerEnhancerMiddleware');

var _routerEnhancerMiddleware2 = _interopRequireDefault(_routerEnhancerMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var modules = {};
var PREFIX = exports.PREFIX = {};
var routerRoutes = [];
var ROUTE = exports.ROUTE = {};
var PageSwitch = exports.PageSwitch = null;

var createChildObject = function createChildObject(key, object) {
    var keyParts = key.split('.');

    if (keyParts.length > 1) {
        var newObject = object[keyParts.shift()];

        return createChildObject(keyParts.join('.'), newObject);
    }

    object[key] = {};

    return object;
};

var findPrefix = function findPrefix(route) {
    if ((0, _findInObject2.default)(route, PREFIX) !== null) {
        return (0, _findInObject2.default)(route, PREFIX);
    }

    var routeParts = route.split('.');

    if (routeParts.length > 1) {
        routeParts.pop();

        return findPrefix(routeParts.join('.'));
    }

    return '';
};

var parseRoutes = function parseRoutes(routes) {
    var subroute = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

    if (subroute !== '' && (0, _findInObject2.default)(subroute, ROUTE) === null) {
        createChildObject(subroute, ROUTE);
    }

    var _loop = function _loop(name) {
        if (_typeof(routes[name]) === 'object') {
            if (routes[name].hasOwnProperty('path')) {
                var _routes$name = routes[name],
                    path = _routes$name.path,
                    props = _objectWithoutProperties(_routes$name, ['path']);

                (0, _findInObject2.default)(subroute, ROUTE)[name] = function (params) {
                    return findPrefix(subroute) + (0, _pathToRegexp.compile)(path)(params);
                };
                routerRoutes.push(_react2.default.createElement(_reactRouter.Route, _extends({ key: path, path: findPrefix(subroute) + path }, props)));
            } else {
                parseRoutes(routes[name], subroute === '' ? name : subroute + '.' + name);
            }
        } else {
            (0, _findInObject2.default)(subroute, ROUTE)[name] = function (params) {
                return findPrefix(subroute) + (0, _pathToRegexp.compile)(routes[name])(params);
            };
        }
    };

    for (var name in routes) {
        _loop(name);
    }
};

var addModule = exports.addModule = function addModule(module) {
    if (!module.hasOwnProperty('NAME') || modules.hasOwnProperty(module.NAME)) {
        throw new Error('Each module needs a unique NAME property.');
    }

    modules[module.NAME] = module;

    if (module.hasOwnProperty('ROUTE') && _typeof(module.ROUTE) === 'object') {
        parseRoutes(module.ROUTE);
    }
};

var configure = exports.configure = function configure(_ref) {
    var prefix = _ref.prefix,
        modules = _ref.modules;

    if (prefix) {
        Object.assign(PREFIX, prefix);
    }

    if (modules && modules instanceof Array) {
        for (var i = 0, n = modules.length; i < n; i++) {
            addModule(modules[i]);
        }
    }

    exports.PageSwitch = PageSwitch = function PageSwitch() {
        return _react2.default.createElement(
            _reactRouter.Switch,
            null,
            routerRoutes
        );
    };
};

exports.routerEnhancerMiddleware = _routerEnhancerMiddleware2.default;
exports.default = ROUTE;