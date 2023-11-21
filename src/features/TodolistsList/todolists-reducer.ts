import {todolistsAPI, TodolistType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {RequestStatusType, setAppStatusAC, SetAppStatusActionType} from '../../app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {fetchTasksTC, setTasksAC} from "./tasks-reducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
  name: 'todolists',
  initialState,
  reducers: {
    removeTodolistAC(state, action: PayloadAction<{ id: string }>) {
      const index = state.findIndex(todoList => todoList.id === action.payload.id)
      if (index > -1) {
        state.splice(index, 1)
      }
    },
    addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
      state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
    },
    changeTodolistTitleAC(state, action: PayloadAction<{ id: string, title: string }>) {
      state.map(todolist =>
         todolist.id === action.payload.id ? {...todolist, title: action.payload.title} : todolist)
    },
    changeTodolistFilterAC(state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) {
      const index = state.findIndex(todoList => todoList.id === action.payload.id)
      state[index].filter = action.payload.filter
    },
    changeTodolistEntityStatusAC(state, action: PayloadAction<{ id: string, status: RequestStatusType }>) {
      state.map(todolist =>
         todolist.id === action.payload.id ? {...todolist, entityStatus: action.payload.status} : todolist)
    },
    setTodolistsAC(state, action: PayloadAction<{ todolists: Array<TodolistType> }>) {
      return action.payload.todolists.map(todolist => ({...todolist, entityStatus: 'idle', filter: 'all'}))
    },
    clearTodosDataAC(state) {
      state = []
    },
  }
})

export const todolistsReducer = slice.reducer
export const {
  clearTodosDataAC,
  removeTodolistAC,
  setTodolistsAC,
  addTodolistAC,
  changeTodolistTitleAC,
  changeTodolistEntityStatusAC,
  changeTodolistFilterAC
} = slice.actions
// actions


// thunks
export const fetchTodolistsTC = () => {
  return (dispatch: any) => {
    dispatch(setAppStatusAC({status: "loading"}))

    todolistsAPI.getTodolists()
       .then((res) => {
         dispatch(setTodolistsAC({todolists: res.data}))
         dispatch(setAppStatusAC({status: "succeeded"}))

         return res.data
       })
       .then(todoLists => {
         todoLists.forEach(todoList => dispatch(fetchTasksTC(todoList.id)))
       })
       .catch(e => {
         handleServerNetworkError(e, dispatch)
       })
  }
}
export const removeTodolistTC = (todolistId: string) => {
  return (dispatch: ThunkDispatch) => {
    //изменим глобальный статус приложения, чтобы вверху полоса побежала
    dispatch(setAppStatusAC({status: "loading"}))

    //изменим статус конкретного тудулиста, чтобы он мог задизеблить что надо
    dispatch(changeTodolistEntityStatusAC({id: todolistId, status: 'loading'}))
    todolistsAPI.deleteTodolist(todolistId)
       .then((res) => {
         dispatch(removeTodolistAC({id: todolistId}))
         //скажем глобально приложению, что асинхронная операция завершена
         dispatch(setAppStatusAC({status: "succeeded"}))

       })
  }
}
export const addTodolistTC = (title: string) => {
  return (dispatch: ThunkDispatch) => {
    dispatch(setAppStatusAC({status: "loading"}))

    todolistsAPI.createTodolist(title)
       .then((res) => {
         dispatch(addTodolistAC({todolist: res.data.data.item}))
         dispatch(setAppStatusAC({status: "succeeded"}))

       })
  }
}
export const changeTodolistTitleTC = (id: string, title: string) => {
  return (dispatch: Dispatch<ActionsType>) => {
    todolistsAPI.updateTodolist(id, title)
       .then((res) => {
         dispatch(changeTodolistTitleAC({id, title}))
       })
  }
}

// types
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>;
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>;
export type SetTodolistsActionType = ReturnType<typeof setTodolistsAC>;
export type ClearTodosDataActionType = ReturnType<typeof clearTodosDataAC>;
type ActionsType =
   | RemoveTodolistActionType
   | AddTodolistActionType
   | ReturnType<typeof changeTodolistTitleAC>
   | ReturnType<typeof changeTodolistFilterAC>
   | SetTodolistsActionType
   | ReturnType<typeof changeTodolistEntityStatusAC>
   | ClearTodosDataActionType
export type FilterValuesType = 'all' | 'active' | 'completed';
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType
  entityStatus: RequestStatusType
}
type ThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType>
