import {
  AddTodolistActionType,
  ClearTodosDataActionType,
  RemoveTodolistActionType,
  SetTodolistsActionType,
  clearTodosDataAC, addTodolistAC, removeTodolistAC, setTodolistsAC
} from './todolists-reducer'
import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistsAPI,
  TodolistType,
  UpdateTaskModelType
} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {AppRootStateType} from '../../app/store'
import {SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from '../../app/app-reducer'
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils'
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: TasksStateType = {}

const slice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    removeTaskAC(state, action: PayloadAction<{ taskId: string, todolistId: string }>) {
      // state[action.payload.todolistId].filter(task => task.id !== action.payload.taskId)
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex(task => task.id === action.payload.taskId)
      if (index > -1) {
        tasks.splice(index, 1)
      }

    },
    addTaskAC(state, action: PayloadAction<{ task: TaskType }>) {
      state[action.payload.task.todoListId].unshift(action.payload.task)
    },
    updateTaskAC(state, action: PayloadAction<{
      taskId: string,
      model: UpdateDomainTaskModelType,
      todolistId: string
    }>) {
      // state[action.payload.todolistId].map(task =>
      //    task.id === action.payload.taskId ? {...task, ...action.payload.model} : task)
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex(task => task.id === action.payload.taskId)
      if (index > -1) {
        tasks[index] = {...tasks[index], ...action.payload.model}
      }
    },
    setTasksAC(state, action: PayloadAction<{ tasks: Array<TaskType>, todolistId: string }>) {
      state[action.payload.todolistId] = action.payload.tasks

    },
  },
  extraReducers: builder => {
    builder.addCase(setTodolistsAC, (state, action) => {
      return Object.fromEntries(action.payload.todolists.map(todoList => ([todoList.id, []])))
    })
    builder.addCase(clearTodosDataAC, (state, action) => {
      return {}
    })
    builder.addCase(removeTodolistAC, (state, action) => {
      // const {[action.payload.id]: [], ...rest} = state
      // return rest
      delete state[action.payload.id]

    })
    builder.addCase(addTodolistAC, (state, action) => {
      state[action.payload.todolist.id] = []
    })
  }

})
export const tasksReducer = slice.reducer
export const {
  removeTaskAC,
  setTasksAC,
  updateTaskAC,
  addTaskAC
} = slice.actions

// export const tasksReducer = (state: TasksStateType = initialState, action: any): TasksStateType => {
//   switch (action.type) {
//     case clearTodosDataAC.type:
//       return {}
//     case 'REMOVE-TASK':
//       return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
//     case 'ADD-TASK':
//       return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
//     case 'UPDATE-TASK':
//       return {
//         ...state,
//         [action.todolistId]: state[action.todolistId]
//            .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
//       }
//     case addTodolistAC.type:
//       return {...state, [action.payload.todolist.id]: []}
//     case removeTodolistAC.type:
//       const {[action.payload.id]: [], ...rest} = state
//       return rest
//     case setTodolistsAC.type:
//       return Object.fromEntries(action.payload.todolists.map((todolist: TodolistType) => ([todolist.id, []])))
//     case 'SET-TASKS':
//       return {...state, [action.todolistId]: action.tasks}
//     default:
//       return state
//   }
// }

// actions
// export const removeTaskAC = (taskId: string, todolistId: string) => ({type: 'REMOVE-TASK', taskId, todolistId} as const)
// export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task} as const)
// export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) => ({
//   type: 'UPDATE-TASK',
//   model,
//   todolistId,
//   taskId
// } as const)
// export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) => ({
//   type: 'SET-TASKS',
//   tasks,
//   todolistId
// } as const)

// thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch<ActionsType | SetAppStatusActionType>) => {
  dispatch(setAppStatusAC({status: "loading"}))

  todolistsAPI.getTasks(todolistId)
     .then((res) => {
       const tasks = res.data.items
       dispatch(setTasksAC({tasks, todolistId}))
       dispatch(setAppStatusAC({status: "succeeded"}))

     })
}
export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
  todolistsAPI.deleteTask(todolistId, taskId)
     .then(res => {
       const action = removeTaskAC({taskId, todolistId})
       dispatch(action)
     })
}
export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch<ActionsType | SetAppErrorActionType | SetAppStatusActionType>) => {
  dispatch(setAppStatusAC({status: "loading"}))

  todolistsAPI.createTask(todolistId, title)
     .then(res => {
       if (res.data.resultCode === 0) {
         const task = res.data.data.item
         const action = addTaskAC({task})
         dispatch(action)
         dispatch(setAppStatusAC({status: "succeeded"}))

       } else {
         handleServerAppError(res.data, dispatch);
       }
     })
     .catch((error) => {
       handleServerNetworkError(error, dispatch)
     })
}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
   (dispatch: ThunkDispatch, getState: () => AppRootStateType) => {
     const state = getState()
     const task = state.tasks[todolistId].find(t => t.id === taskId)
     if (!task) {
       //throw new Error("task not found in the state");
       console.warn('task not found in the state')
       return
     }

     const apiModel: UpdateTaskModelType = {
       deadline: task.deadline,
       description: task.description,
       priority: task.priority,
       startDate: task.startDate,
       title: task.title,
       status: task.status,
       ...domainModel
     }

     todolistsAPI.updateTask(todolistId, taskId, apiModel)
        .then(res => {
          if (res.data.resultCode === 0) {
            const action = updateTaskAC({taskId, model: domainModel, todolistId})
            dispatch(action)
          } else {
            handleServerAppError(res.data, dispatch);
          }
        })
        .catch((error) => {
          handleServerNetworkError(error, dispatch);
        })
   }

// types
export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
export type TasksStateType = {
  [key: string]: Array<TaskType>
}
type ActionsType =
   | ReturnType<typeof removeTaskAC>
   | ReturnType<typeof addTaskAC>
   | ReturnType<typeof updateTaskAC>
   | AddTodolistActionType
   | RemoveTodolistActionType
   | SetTodolistsActionType
   | ClearTodosDataActionType
   | ReturnType<typeof setTasksAC>
type ThunkDispatch = Dispatch<ActionsType | SetAppStatusActionType | SetAppErrorActionType>
