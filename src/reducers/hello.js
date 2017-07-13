import {
  SET_HELLO_DATA,
  MAP_HELLO_WITH_API,
  RESET_HELLO,
  UNUSED_ACION
} from '../action-creator.sync.js'

const defaultState = {
  unique_id: '0',
  message: 'How are you today ?',
  messageDeep: {
    begin: 'I am',
    middle: 'fine today',
    end: ', tank you.'
  }
}

export default function hello (state = defaultState, action) {
  switch (action.type) {
    case SET_HELLO_DATA:
      return {...state, ...action.hello, unique_id: '0'}

    case MAP_HELLO_WITH_API: // Why is hello in orange here ?
      return {
        unique_id: action.hello.unique_id,
        message: action.hello.msg.toString(),
        messageDeep: {
          begin: action.hello.deep.beg,
          middle: action.hello.deep.mid,
          end: action.hello.deep.end
        }
      }

    case RESET_HELLO:
      return defaultState

    case UNUSED_ACION: // why is .map() not in green here since .toString() is ?
      return {
        unused: action.hello.map(h => ({id: h.id, msg: h.message}))
      }

    default:
      return state
  }
}
