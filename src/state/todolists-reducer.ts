import {v1} from 'uuid';
import {todolistsAPI, TodolistType} from '../api/todolists-api'
import {AnyAction, Dispatch} from "redux";

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>
export type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>
export type GetTodolistsActionType = ReturnType<typeof getTodolistsAC>

type ActionsType = RemoveTodolistActionType | AddTodolistActionType
   | ChangeTodolistTitleActionType
   | ChangeTodolistFilterActionType | GetTodolistsActionType

const initialState: Array<TodolistDomainType> = []

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
}

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
  switch (action.type) {
    case "GET-TODOLISTS":
      return action.todolists.map(todoList => ({...todoList, filter: "all"}))
    case 'REMOVE-TODOLIST': {
      return state.filter(tl => tl.id !== action.id)
    }
    case 'ADD-TODOLIST': {
      return [{
        id: action.todolistId,
        title: action.title,
        filter: 'all',
        addedDate: '',
        order: 0
      }, ...state]
    }
    case 'CHANGE-TODOLIST-TITLE': {
      const todolist = state.find(tl => tl.id === action.id);
      if (todolist) {
        // если нашёлся - изменим ему заголовок
        todolist.title = action.title;
      }
      return [...state]
    }
    case 'CHANGE-TODOLIST-FILTER': {
      const todolist = state.find(tl => tl.id === action.id);
      if (todolist) {
        // если нашёлся - изменим ему заголовок
        todolist.filter = action.filter;
      }
      return [...state]
    }
    default:
      return state;
  }
}

// thunks creator
export const setTodoListTC = () => (dispatch: Dispatch) => {
  todolistsAPI.getTodolists()
     .then(response => {
       dispatch(getTodolistsAC(response.data))
     })
}


// actions creator
export const removeTodolistAC = (todolistId: string) => {
  return {type: 'REMOVE-TODOLIST', id: todolistId} as const
}
export const addTodolistAC = (title: string) => {
  return {type: 'ADD-TODOLIST', title: title, todolistId: v1()} as const
}
export const changeTodolistTitleAC = (id: string, title: string) => {
  return {type: 'CHANGE-TODOLIST-TITLE', id: id, title: title} as const
}
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => {
  return {type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter} as const
}

export const getTodolistsAC = (todolists: TodolistType[]) => {
  return {type: 'GET-TODOLISTS', todolists} as const
}