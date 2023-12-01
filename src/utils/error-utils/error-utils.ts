import {Dispatch} from "redux";
import axios from "axios";
import {setAppError, setAppStatus} from "../../app/app-reducer";
import {ResponseType} from "../../api/todolists-api";


export const handleServerAppError = <T>(data: ResponseType<T>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(setAppError(data.messages[0]))
  } else {
    dispatch(setAppError('Some error occurred'))
  }
  dispatch(setAppStatus("failed"))

}

export const handleServerNetworkAppError = (error: unknown, dispatch: Dispatch) => {
  let errorMessage: string
  if (axios.isAxiosError(error)) {
    errorMessage = error.response ? error.response.data.message : error.message
  } else {
    errorMessage = (error as Error).message
  }
  dispatch(setAppError(errorMessage))
  dispatch(setAppStatus("failed"))
}