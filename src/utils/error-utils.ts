import {setAppErrorAC, SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from '../app/app-reducer'
import {ResponseType} from '../api/todolists-api'
import {Dispatch} from 'redux'
import axios from "axios";


export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch<SetAppErrorActionType | SetAppStatusActionType>) => {
  if (data.messages.length) {
    dispatch(setAppErrorAC(data.messages[0]))
  } else {
    dispatch(setAppErrorAC('Some error occurred'))
  }
  dispatch(setAppStatusAC('failed'))
}

export const handleServerNetworkError = (error: unknown, dispatch: Dispatch) => {
  let errorMessage: string
  if (axios.isAxiosError(error)) {
    errorMessage = error.response ? error.response.data.messages[0] : error.message
  } else {
    errorMessage = (error as Error).message
  }
  dispatch(setAppErrorAC(errorMessage))
  dispatch(setAppStatusAC('failed'))
}
