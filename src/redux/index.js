import thunk from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'
import { compose, createStore, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'

import mySaga from './sagas'
import rootReducer from './rootReducers'

const sagaMiddleware = createSagaMiddleware()

let storeEnhancers
if (process.env.NODE_ENV === 'production') {
  storeEnhancers = compose(applyMiddleware(sagaMiddleware))
} else {
  // storeEnhancers = compose(composeWithDevTools(applyMiddleware(thunk, logger)))
  storeEnhancers = compose(composeWithDevTools(applyMiddleware(sagaMiddleware)))
}

const configureStore = (initialState = {}) => {
  const store = createStore(rootReducer, initialState, storeEnhancers)

  if (module.hot && process.env.NODE_ENV !== 'production') {
    sagaMiddleware.run(mySaga)
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./rootReducers', () => {
      console.log('replacing reducer...')
      const nextRootReducer = require('./rootReducers').default
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}

export default configureStore()
