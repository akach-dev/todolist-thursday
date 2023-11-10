import {TasksStateType} from '../App';
import {v1} from 'uuid';
import {AddTodolistActionType, GetTodolistsActionType, RemoveTodolistActionType} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI} from '../api/todolists-api'
import {Dispatch} from "redux";

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

type ActionsType = RemoveTaskActionType | AddTaskActionType
   | ChangeTaskStatusActionType
   | ChangeTaskTitleActionType
   | AddTodolistActionType
   | RemoveTodolistActionType
   | GetTodolistsActionType
   | SetTaskActionType

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
    case 'REMOVE-TASK': {
      const stateCopy = {...state}
      const tasks = stateCopy[action.todolistId];
      const newTasks = tasks.filter(t => t.id !== action.taskId);
      stateCopy[action.todolistId] = newTasks;
      return stateCopy;
    }
    case 'ADD-TASK':
      return {
        ...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
      }
    case 'CHANGE-TASK-STATUS': {
      let todolistTasks = state[action.todolistId];
      let newTasksArray = todolistTasks
         .map(t => t.id === action.taskId ? {...t, status: action.status} : t);

      state[action.todolistId] = newTasksArray;
      return ({...state});
    }
    case 'CHANGE-TASK-TITLE': {
      let todolistTasks = state[action.todolistId];
      // найдём нужную таску:
      let newTasksArray = todolistTasks
         .map(t => t.id === action.taskId ? {...t, title: action.title} : t);

      state[action.todolistId] = newTasksArray;
      return ({...state});
    }
    case 'ADD-TODOLIST': {
      return {
        ...state,
        [action.todoList.id]: []
      }
    }
    case 'REMOVE-TODOLIST': {
      const copyState = {...state};
      delete copyState[action.id];
      return copyState;
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
