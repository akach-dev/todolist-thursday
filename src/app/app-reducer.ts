const initialState = {
  status: 'idle' as RequestStatusType,
  error: null as null | string,
  isInitialized: false
}


export const appReducer = (state: InitialState = initialState, action: ActionsType): InitialState => {
  switch (action.type) {

    case "app/SET-INITIALIZED":
      return {
        ...state, isInitialized: action.isInitialized
      }
    case "app/SET-STATUS":
      return {
        ...state, status: action.status
      }
    case "app/SET-ERROR":
      return {
        ...state, error: action.error
      }

    default:
      return state
  }
}

// types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type SetAppStatus = ReturnType<typeof setAppStatus>
export type SetAppError = ReturnType<typeof setAppError>
export type SetAppIsInitialized = ReturnType<typeof setAppIsInitialized>
type InitialState = typeof initialState
type ActionsType = SetAppStatus | SetAppError | SetAppIsInitialized

// actions
export const setAppStatus = (status: RequestStatusType) => ({type: 'app/SET-STATUS', status} as const)
export const setAppError = (error: null | string) => ({type: 'app/SET-ERROR', error} as const)
export const setAppIsInitialized = (isInitialized: boolean) => ({type: 'app/SET-INITIALIZED', isInitialized} as const)


