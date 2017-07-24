# wikom-router

wikom-router makes **route management and creation** easier inside your react application.

## Installation

Add wikom-router to your js project with yarn:

```javascript
yarn add git+https://github.com/Wikom/wikom-router.git
```

or with npm:

```javascript
npm install --save git+https://github.com/Wikom/wikom-router.git
```

You can also add the standalone build directly to your page. Download dist/index.js and add it to your html-page:

```html
<script src="path-to-your-downloaded-js-file"></script>
```

Remember to include all dependencies as well.

## Usage

### Step 1: Define your routes

You can either define your application routes globally or (for large applications) in chunks or modules.
No matter how many route configurations you have: Each configuration needs a unique NAME property and a ROUTE property.
The ROUTE property needs to be an object with the main route namespaces you want to provide.
You can define as many namespaces as you see fit and nest them according to your preferences. 
You should group your routes by type or target, i.e. keep your page routes (your routes INSIDE your application)
in one namespace and your api routes in another. If your application sends requests to more than one api host
you should use one namespace for EACH of those hosts.

Each individual route is either an object (containing at least a 'path' property)
or a simple string (that is used directly as the path of the route).

If you define your route as an object it is treated as a route for react-router,
so it needs to also have one of the required properties of a react-router route (component, render or children)

You should not include protocols, hostnames or port numbers in your routes. Those parts of an URL are usually redundant
and can be configured in step 2.

You can parameterize your routes (using the same syntax react-router does).
A named route parameter starts with a colon and ends with the next slash (or the end of the route).
Optional parameters are followed by a question mark.
For more information see https://www.npmjs.com/package/path-to-regexp

### Step 2: Configure your application with your routes

To use your routes inside your application you have to call the `configure()` function of `wikom-router` in your entry script.

`configure` expects an object as parameter with a `modules` property (containing an array of all your route configurations)
and an optional `prefix` property with which you can pass path prefixes for your route namespaces.
For page routes this can be the common part of the path for your application (usually `'/'`).
For api routes this should be the `protocol://hostname:port` part for your api requests.

### Step 3: Use your routes anywhere inside your application

There are 2 common use cases for `wikom-router` inside your application:
1. Building the `<Route>` components for your `react-router`
2. Building URLs for links and API requests

If you want to fill your `react-router` with automatically generated `<Route>` components, you can simply use the
`<PageSwitch>` component exported by `wikom-router` and pass it as single child to the `react-router` component of your choice.

To build URLs you can make use of `wikom-router`'s default export `ROUTE`.

`ROUTE` is an object containing one property for each namespace provided by the route configurations.
For each nested namespace a corresponding (nested) child property is created.
Each actual route of the configurations can be found as a property (with the same path and the same name)
and can be called as a function that returns the (prefixed) URL.
If the path contains parameters you pass the values with which the parameters should be replaced for URL creation
as an object of key value pairs to that function. The keys are the parameter names and the values the actual values
to replace each parameter.

For example - if a route is defined like this:

```javascript
ROUTE: {
    API: {
        PAGE: '/page/:id'
    }
}
```

and the application is configured like this:

```javascript
configure({
    prefix: {
        API: 'http://localhost'
    },
    modules: [...module configurations...]
});
```

you can use `ROUTE` like this:

```javascript
ROUTE.API.PAGE({id: 1})
```

and get a plain URL like this:

```javascript
http://localhost/page/1
```

which can be used for API calls or whatever else you have in mind...

## Example

### Setup

Your common module file `./common-module.js`

```javascript
import React from 'react'

/**
 * Usually you would import your page components or render functions here
 */
const Contact = () => <div>Contact-Page</div>;
const About = () => <div>About-Page</div>;
const NotFound = () => <div>Not-Found-Page</div>;

export default {
    NAME: 'common',
    ROUTE: {
        PAGE: {
            CONTACT: {
                path: '/contact',
                component: Contact
            },
            ABOUT: {
                path: '/about',
                component: About
            },
            /**
             * Add more pages here.
             * Everything that goes inside a React-Router-<Route>-Component is allowed
             */
            // This needs to come last if you want a catch-all route!
            NOT_FOUND: {
                path: '/',
                component: NotFound,
            }
        },
        API: {
            PLAIN_EXAMPLE: '/example',
            PARAMETER_EXAMPLE: '/example/:id',
            SUBROUTES: {
                EXAMPLE_2: '/example_2',
                EXAMPLE_3: '/example_3'
            }
        }
        /**
         * Add more namespaces and routes here.
         * Routes can be nested according to your preferences.
         */
    }
}
```

Your application entry point `./index.js`

```javascript
import React from 'react'
import ReactDOM from 'react-dom'
import {configure, PageSwitch} from 'wikom-router'
// import all your module files
import COMMON from './common-module'
// Whatever Router-Component you want to use
import {BrowserRouter} from 'react-router-dom'

configure({
    prefix: {
        API: 'http://localhost'
    },
    modules: [COMMON]
})

/**
 * Do additional entry point stuff...
 * Render your application (into element with id 'app')
 */

ReactDOM.render((
  <BrowserRouter>
    <PageSwitch/>
  </BrowserRouter>
), document.getElementById('app'))
```

### Usage

To generate a Link to a page of your application:

```javascript
import React from 'react'
import {Link} from 'react-router-dom'
import ROUTE from 'wikom-router'

const ContactLink = () =>
    <Link to={ROUTE.PAGE.CONTACT()}>Kontakt</Link>
```

To fetch data from an API endpoint (via superagent):

```javascript
import request from 'superagent'
import ROUTE from 'wikom-router'

request
   .get(ROUTE.API.PLAIN_EXAMPLE())
   .end((err, res) => {
        // do some stuff with the result of your request
   });
```

To fetch data from an API endpoint with some parameter:

```javascript
import request from 'superagent'
import ROUTE from 'wikom-router'

request
   .get(ROUTE.API.PARAMETER_EXAMPLE({id: 1}))
   .end((err, res) => {
        // do some stuff with the result of your request
   });
```

## Extra Tools

`wikom-router` contains a redux middleware to enhance the `react-router-redux` action LOCATION_CHANGE.

If you want to listen to LOCATION_CHANGE events in your own reducers, you might want to know HOW the location has changed.
To find that out you would need access to the routing part of the global state of your redux store.

To achieve that you can add `routerEnhancerMiddleware` to your application store.

`routerEnhancerMiddleware`  adds the `getState` function of the redux store to the LOCATION_CHANGE action object.
By accessing the routing part of the global state you can easily compare the location before and after a LOCATION_CHANGE
event and decide how to react on different kinds of changes.

### Setup

In your entry point or your store configuration:

```javascript
import {createStore, applyMiddleware, compose, combineReducers} from 'redux'
import {routerReducer as routing} from 'react-router-redux'
import {routerEnhancerMiddleware} from 'wikom-router'
// import your own root reducer
import example from './exampleReducer'

const store = createStore(
    combineReducers({
        routing,
        example
        // Add more reducers here...
    }),
    compose(
        applyMiddleware(
            routerEnhancerMiddleware
            // Add other middleware here...
        )
    )
);
```

### Usage

Your own example reducer file `./exampleReducer`

```javascript
import {LOCATION_CHANGE} from 'react-router-redux'

const exampleReducer = (state = {}, action) => {
    switch (action.type) {
        case LOCATION_CHANGE:
            const routingState = action.getState().routing;
            const oldPath = routingState.location.pathname;
            const nextPath = action.payload.pathname;

            if (oldPath !== nextPath) {
                // do stuff only if path has changed, i.e.:
                const initialState = Object.assign({}, state);
                initialState.pathHasChanged = true;
                return initialState;
            }

            return state;
        default:
            return state;
    }
};

export default exampleReducer;
```