import {AuthApi, LoginParams} from "../../api/auth-api";
import {Dispatch} from "redux";
import {setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

const initialState = {
  isLoggedIn: false
}

export const authReducer = (state: InitialState = initialState, action: Actions): InitialState => {
  switch (action.type) {
    case "auth/IS-LOGGED-IN":
      return {
        ...state, isLoggedIn: action.isLoggedIn
      }
    default:
      return state
  }
}

// actions
export const setIsLoggedIn = (isLoggedIn: boolean) => ({type: 'auth/IS-LOGGED-IN', isLoggedIn} as const)

// thunks
export const login = (data: LoginParams) => async (dispatch: Dispatch) => {
  dispatch(setAppStatusAC("loading"))
  try {
    const res = await AuthApi.login(data)
    if (res.data.resultCode === 0) {
      dispatch(setIsLoggedIn(true))
    } else {
      handleServerAppError(res.data, dispatch)
    }
  } catch (e) {
    handleServerNetworkError(e, dispatch)
  }
  dispatch(setAppStatusAC("succeeded"))
}
export const logOut = () => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC('loading'))
  AuthApi.logOut()
     .then(res => {
       if (res.data.resultCode === 0) {
         dispatch(setIsLoggedIn(false))
         dispatch(setAppStatusAC('succeeded'))
       } else {
         handleServerAppError(res.data, dispatch)
       }
     })
     .catch((error) => {
       handleServerNetworkError(error, dispatch)
     })
}


// types
type InitialState = typeof initialState

type Actions = ReturnType<typeof setIsLoggedIn>