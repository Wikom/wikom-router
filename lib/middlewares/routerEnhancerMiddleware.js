'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /**
                                                                                                                                                                                                                                                                   * Created by rouven on 29.06.17.
                                                                                                                                                                                                                                                                   */

var _reactRouterRedux = require('react-router-redux');

var routerEnhancerMiddleware = function routerEnhancerMiddleware(store) {
    return function (next) {
        return function (action) {
            if (action.type === _reactRouterRedux.LOCATION_CHANGE) {
                return next(_extends({}, action, { getState: store.getState }));
            }

            return next(action);
        };
    };
};

exports.default = routerEnhancerMiddleware;