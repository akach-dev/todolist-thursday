import {Dispatch} from 'redux'
import {
  SetAppErrorActionType,
  setAppIsInitializedAC,
  setAppStatusAC,
  SetAppStatusActionType
} from '../../app/app-reducer'
import {authAPI, LoginParamsType} from "../../api/auth-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {clearTodosDataAC} from "../TodolistsList/todolists-reducer";

const initialState = {
  isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case 'login/SET-IS-LOGGED-IN':
      return {...state, isLoggedIn: action.value}
    default:
      return state
  }
}
// actions
export const setIsLoggedInAC = (value: boolean) =>
   ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// thunks
export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch<ActionsType>) => {
  dispatch(setAppStatusAC('loading'))
  authAPI.login(data)
     .then(response => {
       if (response.data.resultCode === 0) {
         dispatch(setAppStatusAC('succeeded'))
         dispatch(setIsLoggedInAC(true))
       } else {
         handleServerAppError(response.data, dispatch);
       }
     })
     .catch((error) => {
       handleServerNetworkError(error, dispatch)
     })
}
export const initializeAppTC = () => (dispatch: Dispatch) => {
  authAPI.me().then(response => {
    if (response.data.resultCode === 0) {
      dispatch(setIsLoggedInAC(true))
    } else {
      handleServerAppError(response.data, dispatch)
    }
  })
     .catch(e => {
       handleServerNetworkError(e, dispatch)
     })
     .finally(() => {
       dispatch(setAppIsInitializedAC(true))
     })
}

export const logoutTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC('loading'))
  authAPI.logout()
     .then(response => {
       if (response.data.resultCode === 0) {
         dispatch(setIsLoggedInAC(false))
         dispatch(setAppStatusAC("succeeded"))
         // dispatch(clearTodosDataAC())
       } else {
         handleServerAppError(response.data, dispatch)
       }
     })
     .catch(e => {
       handleServerNetworkError(e, dispatch)
     })
}


// types
type ActionsType = ReturnType<typeof setIsLoggedInAC> | SetAppStatusActionType | SetAppErrorActionType
