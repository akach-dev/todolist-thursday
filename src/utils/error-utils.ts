import {setAppErrorsAC, setAppStatusAC} from "../app/app-reducer";
import {ResponseType} from "../api/todolists-api";
import {AppThunkDispatch} from "../app/store";
import {AxiosError} from "axios";
import {ErrorType} from "../features/TodolistsList/tasks-reducer";

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: AppThunkDispatch) => {
  if (data.messages.length) {
    dispatch(setAppErrorsAC(data.messages[0]))
  } else {
    dispatch(setAppErrorsAC('Some error occurred'))
  }
  dispatch(setAppStatusAC("failed"))
}
export const handleServerNetworkError = (reason: AxiosError<ErrorType>, dispatch: AppThunkDispatch) => {
  dispatch(setAppErrorsAC(reason.message))
  dispatch(setAppStatusAC("failed"))
}