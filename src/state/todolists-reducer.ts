import {v1} from 'uuid';
import {todoListsAPI, TodolistType} from "../api/todo-lists-a-p-i";
import {Dispatch} from "redux";


export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type SetTodoListsActionType = ReturnType<typeof setTodoListsAC>

type ActionsType =
   RemoveTodolistActionType
   | AddTodolistActionType
   | ReturnType<typeof changeTodolistTitleAC>
   | ReturnType<typeof changeTodolistFilterAC>
   | SetTodoListsActionType

const initialState: Array<TodolistDomainType> = [
  /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
  {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
}

export const todolistsReducer = (state: Array<TodolistDomainType> = initialState, action: ActionsType): Array<TodolistDomainType> => {
  switch (action.type) {
    case "SET-TODOLISTS":
      return action.todoLists.map(todoList => ({...todoList, filter: 'all'}))
    case 'REMOVE-TODOLIST': {
      return state.filter(tl => tl.id !== action.id)
    }
    case 'ADD-TODOLIST': {
      return [{...action.todoList, filter: "all"} as TodolistDomainType, ...state]
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


//actions creator
export const removeTodolistAC = (todolistId: string) => ({type: 'REMOVE-TODOLIST', id: todolistId} as const)
export const addTodolistAC = (todoList: TodolistType) => ({type: 'ADD-TODOLIST', todoList} as const)
export const changeTodolistTitleAC = (id: string, title: string) => ({
  type: 'CHANGE-TODOLIST-TITLE',
  id: id,
  title: title
} as const)
export const changeTodolistFilterAC = (id: string, filter: FilterValuesType) => ({
  type: 'CHANGE-TODOLIST-FILTER',
  id: id,
  filter: filter
} as const)
export const setTodoListsAC = (todoLists: TodolistType[]) => ({type: 'SET-TODOLISTS', todoLists} as const)

// thunks creator
export const fetchTodoListsTC = () => (dispatch: Dispatch) =>
   todoListsAPI.getTodoLists().then(res =>
      dispatch(setTodoListsAC(res.data)))
export const deleteTodoListTC = (todolistId: string) => (dispatch: Dispatch) =>
   todoListsAPI.deleteTodolist(todolistId).then(res =>
      dispatch(removeTodolistAC(todolistId)))
export const createTodolistTC = (title: string) => (dispatch: Dispatch) =>
   todoListsAPI.createTodolist(title).then(res =>
      dispatch(addTodolistAC(res.data.data.item)))
export const updateTodoListTC = (id: string, title: string) => (dispatch: Dispatch) =>
   todoListsAPI.updateTodolist(id, title).then(res =>
      dispatch(changeTodolistTitleAC(id, title))
   )


