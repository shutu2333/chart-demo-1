/* @flow */
const HAS_FILTER = 'HAS_FILTER'

export const defaultState = {
  filter: false,
}

export type State = {
  filter: boolean
}

export function hasFilter(value: boolean) {
  return {
    type: HAS_FILTER,
    payload: value,
  }
}

export type Action = hasFilter

export default function uiReducer(state: State = defaultState, action: Action) {
  switch (action.type) {
    case HAS_FILTER:
      return { ...state, filter: action.payload }
    default:
      return state
  }
}
