/* @flow */

export type State = {
  message: ?string
}


export const defaultState: State = {
  message: null,
}


const messageUpdate: 'factor/error/message:update' = 'factor/error/message:update'

type MessageUpdateAction = { type: typeof messageUpdate, message: ?string }

export function UpdateMessage(message: ?string): MessageUpdateAction {
  return {
    type: messageUpdate,
    message,
  }
}

export type Action =
  | MessageUpdateAction


const errorReducer = (state: State = defaultState, action: Action) => {
  switch (action.type) {
    case messageUpdate:
      return { ...state, message: action.message }
    default:
      return state
  }
}

export default errorReducer
