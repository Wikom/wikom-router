"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _reactRouterRedux = require("react-router-redux");

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var routerEnhancerMiddleware = function routerEnhancerMiddleware(store) {
  return function (next) {
    return function (action) {
      if (action.type === _reactRouterRedux.LOCATION_CHANGE) {
        return next(_objectSpread({}, action, {
          getState: store.getState
        }));
      }

      return next(action);
    };
  };
};

var _default = routerEnhancerMiddleware;
exports["default"] = _default;