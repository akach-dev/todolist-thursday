import {todoListsAPI, TodolistType} from "../api/todo-lists-a-p-i";
import {Dispatch} from "redux";
import {setAppStatusAC, SetStatusActionType, StatusType} from "../app/app-reducer";

const initialState: Array<TodolistDomainType> = [
  /*{id: todolistId1, title: 'What to learn', filter: 'all', addedDate: '', order: 0},
  {id: todolistId2, title: 'What to buy', filter: 'all', addedDate: '', order: 0}*/
]
export const todoListsReducer = (state: TodolistDomainType[] = initialState, action: ActionsType): TodolistDomainType[] => {
  switch (action.type) {
    case "CHANGE-TODOLIST-ENTITY_STATUS":
      return state.map(todoList =>
         todoList.id === action.id ? {...todoList, entityStatus: action.status} : todoList
      )
    case "SET-TODOLISTS":
      return action.todoLists.map(todoList => ({...todoList, filter: 'all', entityStatus: "idle"}))
    case 'REMOVE-TODOLIST':
      return state.filter(tl => tl.id !== action.id)
    case 'ADD-TODOLIST':
      return [{...action.todoList, filter: "all"} as TodolistDomainType, ...state]
    case 'CHANGE-TODOLIST-TITLE':
      return state.map(todoList => todoList.id === action.id ? {...todoList, title: action.title} : todoList)
    case 'CHANGE-TODOLIST-FILTER':
      return state.map(todoList => todoList.id === action.id ? {...todoList, filter: action.filter} : todoList)
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
export const changeTodolistEntityStatusAC = (id: string, status: StatusType) => ({
  type: 'CHANGE-TODOLIST-ENTITY_STATUS',
  id,
  status
} as const)
export const setTodoListsAC = (todoLists: TodolistType[]) => ({type: 'SET-TODOLISTS', todoLists} as const)

// thunks creator
export const fetchTodoListsTC = () => (dispatch: Dispatch<ActionsType>) => {
  dispatch(setAppStatusAC("loading"))
  todoListsAPI.getTodoLists().then(res =>
     dispatch(setTodoListsAC(res.data)))
  dispatch(setAppStatusAC("succeeded"))

}
export const deleteTodoListTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
  dispatch(setAppStatusAC("loading"))
  changeTodolistEntityStatusAC(todolistId, "loading")
  todoListsAPI.deleteTodolist(todolistId).then(res =>
     dispatch(removeTodolistAC(todolistId)))
  dispatch(setAppStatusAC("succeeded"))

}
export const createTodolistTC = (title: string) => (dispatch: Dispatch<ActionsType>) => {
  dispatch(setAppStatusAC("loading"))
  todoListsAPI.createTodolist(title).then(res =>
     dispatch(addTodolistAC(res.data.data.item)))
  dispatch(setAppStatusAC("succeeded"))
}
export const updateTodoListTC = (id: string, title: string) => (dispatch: Dispatch<ActionsType>) =>
   todoListsAPI.updateTodolist(id, title).then(res =>
      dispatch(changeTodolistTitleAC(id, title))
   )

// types

export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType,
  entityStatus: StatusType,
}

export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type SetTodoListsActionType = ReturnType<typeof setTodoListsAC>
export type ChangeTodolistEntityStatusActionType = ReturnType<typeof changeTodolistEntityStatusAC>

type ActionsType =
   ChangeTodolistEntityStatusActionType |
   SetStatusActionType |
   RemoveTodolistActionType
   | AddTodolistActionType
   | ReturnType<typeof changeTodolistTitleAC>
   | ReturnType<typeof changeTodolistFilterAC>
   | SetTodoListsActionType
