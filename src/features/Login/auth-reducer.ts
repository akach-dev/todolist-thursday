import {Dispatch} from 'redux'
import {
  setAppIsInitializedAC,
  setAppStatusAC,
} from '../../app/app-reducer'
import {authAPI, LoginParamsType} from "../../api/auth-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false
}
type InitialStateType = typeof initialState

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsLoggedInAC: (state, action: PayloadAction<InitialStateType>) => {
      state.isLoggedIn = action.payload.isLoggedIn
    }
  }
})

// actions
export const setIsLoggedInAC = slice.actions.setIsLoggedInAC
// reducer
export const authReducer = slice.reducer

// thunks
export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({status: "loading"}))
  authAPI.login(data)
     .then(response => {
       if (response.data.resultCode === 0) {
         dispatch(setAppStatusAC({status: "succeeded"}))

       } else {
         handleServerAppError(response.data, dispatch);
       }
     })
     .catch((error) => {
       handleServerNetworkError(error, dispatch)
     })
     .finally(() => {
       dispatch(setIsLoggedInAC({isLoggedIn: true}))
     })
}
export const initializeAppTC = () => (dispatch: Dispatch) => {
  authAPI.me().then(response => {
    if (response.data.resultCode === 0) {
      dispatch(setIsLoggedInAC({isLoggedIn: true}))
    } else {
      handleServerAppError(response.data, dispatch)
    }
  })
     .catch(e => {
       handleServerNetworkError(e, dispatch)
     })
     .finally(() => {
       dispatch(setAppIsInitializedAC({value: true}))
     })

}
export const logoutTC = () => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({status: "loading"}))

  authAPI.logout()
     .then(response => {
       if (response.data.resultCode === 0) {
         dispatch(setIsLoggedInAC({isLoggedIn: false}))
         dispatch(setAppStatusAC({status: "succeeded"}))

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
// type ActionsType = ReturnType<typeof setIsLoggedInAC> | SetAppStatusActionType | SetAppErrorActionType
