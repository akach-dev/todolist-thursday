import {AppRootStateType} from "../../app/store";
import {TodolistDomainType} from "../TodolistsList/todolists-reducer";
import {Dispatch} from "redux";
import {setAppIsInitialized, setAppStatus} from "../../app/app-reducer";
import {AuthApi} from "../../api/auth-api";
import {handleServerAppError, handleServerNetworkAppError} from "../../utils/error-utils/error-utils";

const initialState = {
  isLoggedIn: false
}

export const authReducer = (state: InitialState = initialState, action: Actions) => {
  switch (action.type) {
    case "auth/SET-IS-LOGGED-IN":
      return {
        ...state, isLoggedIn: action.isLoggedIn
      }
    default:
      return state
  }
}

// actions
export const setIsLoggedIn = (isLoggedIn: boolean) => ({type: 'auth/SET-IS-LOGGED-IN', isLoggedIn} as const)

// thunks
export const login = (data: any) => async (dispatch: Dispatch) => {
  dispatch(setAppStatus("loading"))
  try {
    const res = await AuthApi.logIn(data)
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedIn(true))
      dispatch(setAppStatus("succeeded"))
    } else {
      handleServerAppError(res.data, dispatch)
    }

  } catch (e) {
    handleServerNetworkAppError(e, dispatch)
  }

}
export const me = () => async (dispatch: Dispatch) => {
  dispatch(setAppStatus("loading"))
  try {
    const res = await AuthApi.me()
    if (res.data.resultCode === 0) {
      dispatch(setAppIsInitialized(true))
      dispatch(setIsLoggedIn(true))
      dispatch(setAppStatus("succeeded"))
    } else {
      handleServerAppError(res.data, dispatch)
    }

  } catch (e) {
    handleServerNetworkAppError(e, dispatch)
  }
}

// types
type InitialState = typeof initialState
type SetIsLoggedIn = ReturnType<typeof setIsLoggedIn>
type  Actions = SetIsLoggedIn