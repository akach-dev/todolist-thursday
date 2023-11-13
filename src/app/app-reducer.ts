const initialState = {
	status: 'idle' as RequestStatusType,
	error: null as null | string,
}

export const appReducer = (
	state: InitialStateType = initialState,
	action: ActionsType
): InitialStateType => {
	switch (action.type) {
		case 'APP/SET-ERROR':
			return { ...state, error: action.error }
		case 'APP/SET-STATUS':
			return { ...state, status: action.status }
		default:
			return state
	}
}

// actions
export const setAppStatusAC = (status: RequestStatusType) =>
	({ type: 'APP/SET-STATUS', status } as const)
export const setAppErrorsAC = (error: null | string) =>
	({ type: 'APP/SET-ERROR', error } as const)

// types
export type SetAppErrorsActionType = ReturnType<typeof setAppErrorsAC>
export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
type ActionsType = SetAppStatusActionType | SetAppErrorsActionType
type InitialStateType = typeof initialState
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
