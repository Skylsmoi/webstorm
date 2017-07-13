import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer from './reducers/root.js'

export const store = (
  (middleware, reduxDevTools) => createStore(rootReducer, compose(middleware, reduxDevTools || (f => f)))
)(
  applyMiddleware(thunkMiddleware, createLogger()),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
