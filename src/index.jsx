import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import WebstormError from './containers/WebstormError.jsx'
import { store } from './store.js'

require('./css/styles.styl')

ReactDOM.render(
  <Provider store={store}>
    <WebstormError />
  </Provider>
  , document.getElementById('webstorm_error')
)
