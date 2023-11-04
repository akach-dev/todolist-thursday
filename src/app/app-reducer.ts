import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

const initialState: InitialStateType = {
  status: 'idle',
  error: null
}

export const appReducer = (state: InitialStateType = initialState, action: ActionType): InitialStateType => {
  switch (action.type) {
    case 'APP/SET_STATUS':
      return {
        ...state, status: action.status
      }
    case 'APP/SET_ERROR':
      return {
        ...state, error: action.error
      }
    default:
      return {...state}
  }
};


//actions creator
export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET_ERROR', error} as const)
export const setAppStatusAC = (status: StatusType) => ({type: 'APP/SET_STATUS', status} as const)

// types
export type SetErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetStatusActionType = ReturnType<typeof setAppStatusAC>
type ActionType = SetErrorActionType | SetStatusActionType
export type StatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
type InitialStateType = {
  status: StatusType
  error: string | null
}
