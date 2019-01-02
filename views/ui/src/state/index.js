import { createStore, applyMiddleware, compose } from 'redux';
import { emit, init } from 'state/actions/server';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {
};
const middleWare = [thunk.withExtraArgument({emit})];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let store = createStore(
    rootReducer,
    initialState,
    composeEnhancers( applyMiddleware(...middleWare))
);

init(store);

export default store;