import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: InitialStateType = {
  status: 'idle',
  error: null,
  isInitialized: false
}
const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppErrorAC(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error
    },
    setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status
    },
    setAppIsInitializedAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isInitialized = action.payload.value
    }
  }
})


export const appReducer = slice.reducer
export const {setAppErrorAC, setAppStatusAC, setAppIsInitializedAC} = slice.actions

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
  // происходит ли сейчас взаимодействие с сервером
  status: RequestStatusType
  // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
  error: string | null
  isInitialized: boolean
}


export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppIsInitializedActionType = ReturnType<typeof setAppIsInitializedAC>

type ActionsType =
   | SetAppErrorActionType
   | SetAppStatusActionType
   | SetAppIsInitializedActionType
