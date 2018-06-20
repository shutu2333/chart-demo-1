/* @flow */

export const reset: 'factors/store/reset' = 'factors/store/reset'
export type ResetAction = { type: typeof reset, value: null }

export function Reset(): ResetAction {
  return { type: reset, value: null }
}

export type State = {|
  ready: boolean,
|}

export const defaultState : State = {
  ready: false,
}

const readySet: 'factor/store/ready:set' = 'factor/store/ready:set'
type ReadySetAction = { type: typeof readySet, value: boolean }


export function SetReady(value: boolean): ReadySetAction {
  return {
    type: readySet,
    value,
  }
}

export type Action =
  | ResetAction
  | ReadySetAction


export default function store(state: State = defaultState, action: Action): State {
  switch (action.type) {
    case readySet:
      return {
        ready: action.value,
      }
    default:
      return state
  }
}

export function makeGlobal<DS>(ds: DS) {
  return function<S: { store: State }, A: $Supertype<Action>> (state: S, action: A): S {
    switch (action.type) {
      case reset:
        return ({
          ...ds,
          store: {
            ready: true,
          },
        }: any)

      default:
        return state
    }
  }
}
