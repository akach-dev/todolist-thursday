import {TasksStateType} from '../App';
import {v1} from 'uuid';
import {AddTodolistActionType, GetTodolistsActionType, RemoveTodolistActionType} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from '../api/todolists-api'
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";

const initialState: TasksStateType = {}
export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
  switch (action.type) {
    case "SET-TODOLISTS":
      // return Object.fromEntries(action.todolists.map(todoList => ([todoList.id, []])))

      return action.todolists.reduce((acc, todoList) => {
        acc[todoList.id] = [];
        return acc;

      }, {...state});
    case "SET-TASKS":
      return {
        ...state,
        [action.todolistId]: action.tasks
      }
    case 'REMOVE-TASK':
      return {
        ...state,
        [action.todolistId]: state[action.todolistId].filter(task => task.id !== action.todolistId)
      }
    case 'ADD-TASK':
      return {
        ...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
      }
    case 'ADD-TODOLIST': {
      return {
        ...state,
        [action.todoList.id]: []
      }
    }
    case 'REMOVE-TODOLIST': {

      const {[action.id]: [], ...rest} = state
      return rest

    }
    case "UPDATE-TASKS":
      return {
        ...state, [action.todolistId]: state[action.todolistId].map(task =>
           task.id === action.taskId ? {...task, ...action.model} : task
        )
      }
    default:
      return state;
  }
}


// thunks creator

export const setTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
  todolistsAPI.getTasks(todolistId)
     .then(response => {
       dispatch(setTasksAC(todolistId, response.data.items))
     })
}

export const removeTasksTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
  todolistsAPI.deleteTask(todolistId, taskId)
     .then(response => {
       dispatch(removeTaskAC(taskId, todolistId))
     })
}

export const addTasksTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
  todolistsAPI.createTask(todolistId, title)
     .then(response => {
       dispatch(addTaskAC(response.data.data.item))
     })
}

export const updateTaskTC = (todolistId: string, model: UpdateDomainTaskModelType, taskId: string) => (dispatch: Dispatch, getState: () => AppRootStateType) => {
  const task = getState().tasks[todolistId].find(task => task.id === taskId)
  debugger

  if (!task) {
    return
  }
  const apiModel: UpdateTaskModelType = {
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    startDate: task.startDate,
    deadline: task.deadline,
    ...model
  }

  todolistsAPI.updateTask(todolistId, taskId, apiModel)
     .then(response => {
       dispatch(updateTaskAC(todolistId, model, taskId))
     })
}

// actions creator
export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
  return {type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId}
}
export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task} as const)
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string): ChangeTaskStatusActionType => {
  return {type: 'CHANGE-TASK-STATUS', status, todolistId, taskId}
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string): ChangeTaskTitleActionType => {
  return {type: 'CHANGE-TASK-TITLE', title, todolistId, taskId}
}
export const setTasksAC = (todolistId: string, tasks: TaskType[]) => ({type: 'SET-TASKS', todolistId, tasks} as const)
export const updateTaskAC = (todolistId: string, model: UpdateDomainTaskModelType, taskId: string) => ({
  type: 'UPDATE-TASKS',
  todolistId,
  model, taskId
} as const)

// types
export type UpdateDomainTaskModelType = {
  title?: string
  description?: string
  status?: TaskStatuses
  priority?: TaskPriorities
  startDate?: string
  deadline?: string
}
export type RemoveTaskActionType = {
  type: 'REMOVE-TASK',
  todolistId: string
  taskId: string
}
export type ChangeTaskStatusActionType = {
  type: 'CHANGE-TASK-STATUS',
  todolistId: string
  taskId: string
  status: TaskStatuses
}
export type ChangeTaskTitleActionType = {
  type: 'CHANGE-TASK-TITLE',
  todolistId: string
  taskId: string
  title: string
}
export type SetTaskActionType = ReturnType<typeof setTasksAC>
export type AddTaskActionType = ReturnType<typeof addTaskAC>
export type UpdateTasActionType = ReturnType<typeof updateTaskAC>

type ActionsType = RemoveTaskActionType | AddTaskActionType
   | ChangeTaskStatusActionType
   | ChangeTaskTitleActionType
   | AddTodolistActionType
   | RemoveTodolistActionType
   | GetTodolistsActionType
   | SetTaskActionType
   | UpdateTasActionType