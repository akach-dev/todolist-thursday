const initialState = {
  status: 'idle' as RequestStatusType
}


export const appReducer = (state: InitialState = initialState, action: ActionsType): InitialState => {
  switch (action.type) {
    case "app/SET-STATUS":
      return {
        ...state, status: action.status
      }

    default:
      return state
  }
}

// types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type SetAppStatus = ReturnType<typeof setAppStatus>
type InitialState = typeof initialState
type ActionsType = SetAppStatus

// actions
export const setAppStatus = (status: RequestStatusType) => ({type: 'app/SET-STATUS' as const, status})


