/* @flow */
import { applyMiddleware } from 'redux'
import freeze from 'deep-freeze-strict'


const freezer = applyMiddleware(store => next => action => {
  freeze(store.getState())
  return next(action)
})

export default freezer
