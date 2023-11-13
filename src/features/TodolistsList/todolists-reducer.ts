import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {
  RequestStatusType,
  SetAppErrorsActionType,
  setAppStatusAC,
  SetAppStatusActionType,
} from '../../app/app-reducer'

const initialState: Array<TodolistDomainType> = []

export const todolistsReducer = (
   state: Array<TodolistDomainType> = initialState,
   action: ActionsType
): Array<TodolistDomainType> => {
  switch (action.type) {
    case 'CHANGE-TODOLISTS-ENTITY-STATUS':
      return state.map(todoList =>
         todoList.id === action.id
            ? {...todoList, entityStatus: action.status}
            : todoList
      )
    case 'REMOVE-TODOLIST':
      return state.filter(tl => tl.id !== action.id)
    case 'ADD-TODOLIST':
      return [
        {...action.todolist, filter: 'all', entityStatus: 'idle'},
        ...state,
      ]
    case 'CHANGE-TODOLIST-TITLE':
      return state.map(tl =>
         tl.id === action.id ? {...tl, title: action.title} : tl
      )
    case 'CHANGE-TODOLIST-FILTER':
      return state.map(todoList =>
         todoList.id === action.id
            ? {...todoList, filter: action.filter}
            : todoList
      )
    case 'SET-TODOLISTS':
      return action.todolists.map(tl => ({
        ...tl,
        filter: 'all',
        entityStatus: 'idle',
      }))
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
  title,
} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
  type: 'CHANGE-TODOLIST-FILTER',
  id,
  filter,
} as const)
export const setTodolistsAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const)
export const setTodolistsEntityStatusAC = (status: RequestStatusType, id: string) => ({
  type: 'CHANGE-TODOLISTS-ENTITY-STATUS',
  status,
  id,
} as const)

// thunks
export const fetchTodolistsTC = () => {
  return (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.getTodolists().then(res => {
      dispatch(setTodolistsAC(res.data))
      dispatch(setAppStatusAC('succeeded'))
    })
  }
}
export const removeTodolistTC = (todolistId: string) => {
  return (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    dispatch(setTodolistsEntityStatusAC('loading', todolistId))
    todolistsAPI.deleteTodolist(todolistId).then(res => {
      dispatch(removeTodolistAC(todolistId))
      dispatch(setAppStatusAC('succeeded'))
    })
  }
}
export const addTodolistTC = (title: string) => {
  return (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    todolistsAPI.createTodolist(title).then(res => {
      dispatch(addTodolistAC(res.data.data.item))
      dispatch(setAppStatusAC('succeeded'))
    })
  }
}
export const changeTodolistTitleTC = (id: string, title: string) => {
  return (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.updateTodolist(id, title).then(res => {
      dispatch(changeTodolistTitleAC(id, title))
    })
  }
}

// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>
export type SetTodolistsEntityStatusActionType = ReturnType<
   typeof setTodolistsEntityStatusAC
>
type ActionsType =
   | RemoveTodolistActionType
   | AddTodolistActionType
   | ReturnType<typeof changeTodolistTitleAC>
   | ReturnType<typeof changeTodolistFilterAC>
   | SetTodolistsActionType
   | SetAppErrorsActionType
   | SetAppStatusActionType
   | SetTodolistsEntityStatusActionType
export type FilterValuesType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
