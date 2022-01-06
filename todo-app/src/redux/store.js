import { createStore, applyMiddleware, compose } from "redux";
import createSagaMiddleware from 'redux-saga';

import rootReducer from "./root-reducer";
import rootSaga from "./root-sagas";

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middlewares)));

sagaMiddleware.run(rootSaga);