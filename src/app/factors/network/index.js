/* @flow */


export type State = {
  loading: number,
}

export const defaultState: State = {
  loading: 0,
}

const loadingInc: 'factors/network/loading:inc' = 'factors/network/loading:inc'
type IncLoadingAction = { type: typeof loadingInc }

export function IncLoading(): IncLoadingAction {
  return {
    type: loadingInc,
  }
}


const loadingDec: 'factors/network/loading:dec' = 'factors/network/loading:dec'
type DecLoadingAction = { type: typeof loadingDec }

export function DecLoading(): DecLoadingAction {
  return {
    type: loadingDec,
  }
}


export type Action =
  | IncLoadingAction
  | DecLoadingAction

export default function Network(state: State = defaultState, action: Action): $Shape<State> {
  switch (action.type) {
    case loadingInc:
      return {
        ...state,
        loading: state.loading + 1,
      }

    case loadingDec:
      return {
        ...state,
        loading: state.loading - 1,
      }
    default:
      return state
  }
}
