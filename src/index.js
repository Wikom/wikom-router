/**
 * Created by rouven on 07.07.17.
 */

import React from 'react'
import {Route, Switch} from 'react-router'
import findInObject from 'find-in-object'
import {compile} from 'path-to-regexp'
import routerEnhancerMiddleware from './middlewares/routerEnhancerMiddleware'

const modules = {};
const PREFIX = {};
const routerRoutes = [];
export const ROUTE = {};
export let PageSwitch = null;

const createChildObject = (key, object) => {
    const keyParts = key.split('.');

    if (keyParts.length > 1) {
        const newObject = object[keyParts.shift()];

        return createChildObject(keyParts.join('.'), newObject);
    }

    object[key] = {};

    return object;
};

const findPrefix = route => {
    if (findInObject(route, PREFIX) !== null) {
        return findInObject(route, PREFIX);
    }

    let routeParts = route.split('.');

    if (routeParts.length > 1) {
        routeParts.pop();

        return findPrefix(routeParts.join('.'));
    }

    return '';
};

const parseRoutes = (routes, subroute = '') => {
    if (subroute !== '' && findInObject(subroute, ROUTE) === null) {
        createChildObject(subroute, ROUTE);
    }

    for (let name in routes) {
        if (typeof routes[name] === 'object') {
            if (routes[name].hasOwnProperty('path')) {
                const {path, ...props} = routes[name];

                findInObject(subroute, ROUTE)[name] = params => (findPrefix(subroute) + compile(path)(params));
                routerRoutes.push(<Route key={path} path={findPrefix(subroute) + path} {...props}/>)
            } else {
                parseRoutes(routes[name], subroute === '' ? name : (subroute + '.' + name));
            }
        } else {
            findInObject(subroute, ROUTE)[name] = params => (findPrefix(subroute) + compile(routes[name])(params));
        }
    }
};

export const addModule = (module) => {
    if (!module.hasOwnProperty('NAME') || modules.hasOwnProperty(module.NAME)) {
        throw new Error('Each module needs a unique NAME property.');
    }

    modules[module.NAME] = module;

    if (module.hasOwnProperty('ROUTE') && typeof module.ROUTE === 'object') {
        parseRoutes(module.ROUTE);
    }
};

export const configure = ({prefix, modules}) => {
    if (prefix) {
        Object.assign(PREFIX, prefix);
    }

    if (modules && modules instanceof Array) {
        for (let i = 0, n = modules.length; i < n; i++) {
            addModule(modules[i]);
        }
    }

    PageSwitch = () => <Switch>{routerRoutes}</Switch>;
};

export {routerEnhancerMiddleware};

export default ROUTE