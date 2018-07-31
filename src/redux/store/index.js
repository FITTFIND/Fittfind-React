/**
 * @providesModule ReduxStore
 */
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import rootReducer from 'ReduxReducers';

// Initializing with middleware
const createStoreWithMiddleware = applyMiddleware(thunk);

const finalCreateStore = compose(createStoreWithMiddleware)(createStore);

// Create the store with an initial (empty) state
// In a complex application, we might rehydrate this state from AsyncStorage or etc

export const store = finalCreateStore(rootReducer);
