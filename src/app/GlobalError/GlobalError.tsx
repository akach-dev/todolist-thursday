import {useEffect} from 'react'
import {useAppDispatch, useAppSelector} from "../store";
import {toast, ToastContainer} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import {selectAppError} from "../app-selectors";
import {setAppError} from "../app-reducer";

export const GlobalError = () => {
  const dispatch = useAppDispatch()
  const errorMessage = useAppSelector(selectAppError)

  useEffect(() => {
    if (errorMessage) {
      toast.error(`🦄 ${errorMessage} `, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      toast.onChange(({status}) => {
        if (status === 'added') {
          dispatch(setAppError(null))
        }
      })
    }
  }, [errorMessage])

  return <ToastContainer/>
}
