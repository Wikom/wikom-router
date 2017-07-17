/**
 * Created by rouven on 29.06.17.
 */

import {LOCATION_CHANGE} from 'react-router-redux'

const routerEnhancerMiddleware = store => next => action => {
    if (action.type === LOCATION_CHANGE) {
        return next({ ...action, getState: store.getState });
    }

    return next(action);
};

export default routerEnhancerMiddleware;