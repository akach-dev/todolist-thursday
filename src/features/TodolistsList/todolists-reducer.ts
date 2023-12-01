import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {RequestStatusType, SetAppStatus, setAppStatus} from "../../app/app-reducer";
import {handleServerNetworkAppError} from "../../utils/error-utils/error-utils";

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
  switch (action.type) {
    case "CHANGE-TODOLISTS-ENTITY-STATUS":
      return state.map(todoList => todoList.id === action.id ? {...todoList, entityStatus: action.status} : todoList)
    case 'REMOVE-TODOLIST':
      return state.filter(tl => tl.id !== action.id)
    case 'ADD-TODOLIST':
      return [{...action.todolist, filter: 'all', entityStatus: "idle"}, ...state]
    case 'CHANGE-TODOLIST-TITLE':
      return state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)
    case 'CHANGE-TODOLIST-FILTER':
      return state.map(tl => tl.id === action.id ? {...tl, filter: action.filter} : tl)
    case 'SET-TODOLISTS':
      return action.todolists.map(tl => ({...tl, filter: 'all', entityStatus: "idle"}))
    default:
      return state
  }
}

// actions
export const removeTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id} as const)
export const addTodolistAC = (todolist: TodolistType) => ({type: 'ADD-TODOLIST', todolist} as const)
export const changeTodolistTitleAC = (id: string, title: string) => ({
  type: 'CHANGE-TODOLIST-TITLE',
  id,
  title
} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
  type: 'CHANGE-TODOLIST-FILTER',
  id,
  filter
} as const)
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const)
export const changeTodolistsEntityStatus = (id: string, status: RequestStatusType) => ({
  type: 'CHANGE-TODOLISTS-ENTITY-STATUS',
  id,
  status
} as const)

// thunks
export const fetchTodolistsTC = () => async (dispatch: Dispatch) => {
  try {
    dispatch(setAppStatus("loading"))
    const res = await todolistsAPI.getTodolists();
    dispatch(setAppStatus("succeeded"))
    dispatch(setTodolistsAC(res.data))
  } catch (e) {
    handleServerNetworkAppError(e, dispatch)
  }

}
export const removeTodolistTC = (todolistId: string) =>
   async (dispatch: Dispatch<ActionsType>) => {
     dispatch(setAppStatus("loading"))
     dispatch(changeTodolistsEntityStatus(todolistId, "loading"))
     const res = await todolistsAPI.deleteTodolist(todolistId)
     if (res.data.resultCode === 0) {
       dispatch(removeTodolistAC(todolistId))
       dispatch(setAppStatus("succeeded"))
     }
   }
export const addTodolistTC = (title: string) =>
   async (dispatch: Dispatch<ActionsType>) => {
     dispatch(setAppStatus("loading"))
     const res = await todolistsAPI.createTodolist(title)
     if (res.data.resultCode === 0) {
       dispatch(setAppStatus("succeeded"))
       dispatch(addTodolistAC(res.data.data.item))
     }
   }
export const changeTodolistTitleTC = (id: string, title: string) =>
   async (dispatch: Dispatch<ActionsType>) => {
     dispatch(setAppStatus("loading"))
     const res = await todolistsAPI.updateTodolist(id, title)
     if (res.data.resultCode === 0) {
       dispatch(changeTodolistTitleAC(id, title))
       dispatch(setAppStatus("succeeded"))
     }
   }

// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
export type ChangeTodolistsEntityStatus = ReturnType<typeof changeTodolistsEntityStatus>;
type ActionsType =
   | RemoveTodolistActionType
   | AddTodolistActionType
   | ReturnType<typeof changeTodolistTitleAC>
   | ReturnType<typeof changeTodolistFilterAC>
   | SetTodolistsActionType
   | SetAppStatus
   | ChangeTodolistsEntityStatus
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}