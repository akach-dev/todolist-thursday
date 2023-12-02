import {Dispatch} from "redux";
import {handleServerNetworkError} from "../utils/error-utils";
import {AuthApi} from "../api/auth-api";
import {setIsLoggedIn} from "../features/Login/auth-reducer";

const initialState: InitialStateType = {
  status: 'idle',
  error: null,
  isInitialized: false
}

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case "APP/SET-IS-INITIALIZED":
      return {
        ...state, isInitialized: action.isInitialized
      }
    case 'APP/SET-STATUS':
      return {...state, status: action.status}
    case 'APP/SET-ERROR':
      return {...state, error: action.error}
    default:
      return {...state}
  }
}

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
  // происходит ли сейчас взаимодействие с сервером
  status: RequestStatusType
  // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
  error: string | null
  isInitialized: boolean
}

export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setAppIsInitialized = (isInitialized: boolean) => ({
  type: 'APP/SET-IS-INITIALIZED',
  isInitialized
} as const)

export const me = () => async (dispatch: Dispatch) => {
  try {
    const res = await AuthApi.me()
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedIn(true))
    }

  } catch (e) {
    handleServerNetworkError(e, dispatch)
  }
  dispatch(setAppIsInitialized(true))
}

export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppsInitialized = ReturnType<typeof setAppIsInitialized>

type ActionsType =
   | SetAppErrorActionType
   | SetAppStatusActionType
   | SetAppsInitialized
