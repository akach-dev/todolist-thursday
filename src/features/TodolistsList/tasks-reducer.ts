import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from './todolists-reducer'
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {AppRootStateType} from '../../app/store'
import {setAppError, setAppStatus} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkAppError} from "../../utils/error-utils/error-utils";

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
  switch (action.type) {
    case 'REMOVE-TASK':
      return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
    case 'ADD-TASK':
      return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
    case 'UPDATE-TASK':
      return {
        ...state,
        [action.todolistId]: state[action.todolistId]
           .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
      }
    case 'ADD-TODOLIST':
      return {...state, [action.todolist.id]: []}
    case 'REMOVE-TODOLIST':
      const copyState = {...state}
      delete copyState[action.id]
      return copyState
    case 'SET-TODOLISTS': {
      const copyState = {...state}
      action.todolists.forEach(tl => {
        copyState[tl.id] = []
      })
      return copyState
    }
    case 'SET-TASKS':
      return {...state, [action.todolistId]: action.tasks}
    default:
      return state
  }
}

// actions
export const removeTaskAC = (taskId: string, todolistId: string) =>
   ({type: 'REMOVE-TASK', taskId, todolistId} as const)
export const addTaskAC = (task: TaskType) =>
   ({type: 'ADD-TASK', task} as const)
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
   ({type: 'UPDATE-TASK', model, todolistId, taskId} as const)
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
   ({type: 'SET-TASKS', tasks, todolistId} as const)

// thunks
export const fetchTasksTC = (todolistId: string) => async (dispatch: Dispatch) => {
  dispatch(setAppStatus("loading"))
  const res = await todolistsAPI.getTasks(todolistId)
  dispatch(setTasksAC(res.data.items, todolistId))
  dispatch(setAppStatus("succeeded"))


}
export const removeTaskTC = (taskId: string, todolistId: string) => async (dispatch: Dispatch) => {
  dispatch(setAppStatus("loading"))
  const res = await todolistsAPI.deleteTask(todolistId, taskId)
  if (res.data.resultCode === 0) {
    dispatch(removeTaskAC(taskId, todolistId))
    dispatch(setAppStatus("succeeded"))
  }
}
export const addTaskTC = (title: string, todolistId: string) => async (dispatch: Dispatch) => {
  dispatch(setAppStatus("loading"))
  try {


    const res = await todolistsAPI.createTask(todolistId, title)
    if (res.data.resultCode === 0) {
      dispatch(addTaskAC(res.data.data.item))
    } else {
      handleServerAppError(res.data, dispatch)
    }
  } catch (e) {
    handleServerNetworkAppError(e, dispatch)
  }
  dispatch(setAppStatus("succeeded"))

}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
   async (dispatch: Dispatch, getState: () => AppRootStateType) => {

     try {
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

       dispatch(setAppStatus("loading"))
       const res = await todolistsAPI.updateTask(todolistId, taskId, apiModel)
       if (res.data.resultCode === 0) {
         dispatch(updateTaskAC(taskId, domainModel, todolistId))
         dispatch(setAppStatus("succeeded"))
       } else {
         handleServerAppError(res.data, dispatch)
       }
     } catch (e) {
       handleServerNetworkAppError(e, dispatch)
     }
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
   | ReturnType<typeof setTasksAC>
