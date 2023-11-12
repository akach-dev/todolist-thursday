const initialState: InitialStateType = {
  status: 'idle' as RequestStatusType,
  error: null
}

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case "APP/SET-ERROR":
      return {...state, error: action.error}
    case 'APP/SET-STATUS':
      return {...state, status: action.status}
    default:
      return state
  }
}

// actions
export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setAppErrorsAC = (error: null | string) => ({type: 'APP/SET-ERROR', error} as const)

// types
type ActionsType = ReturnType<typeof setAppStatusAC> | ReturnType<typeof setAppErrorsAC>
type InitialStateType = {
  status: RequestStatusType
  error: null | string
}
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
