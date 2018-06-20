/* @flow */

import 'url-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import App from './app'

import createStore from './store'

/* setup app and hot reloading */
const store = createStore()

const ConnectedApp = () => (
  <Provider store={ store }><App /></Provider>
)


const mountPoint = document.getElementById('app')
if (!mountPoint) throw new Error('Mount point (#app) not found, check the html source')

ReactDOM.render(<ConnectedApp />, mountPoint)
