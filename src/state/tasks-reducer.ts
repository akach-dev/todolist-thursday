import {TasksStateType} from '../app/App';
import {
  AddTodolistActionType,
  RemoveTodolistActionType,
  SetTodoListsActionType
} from './todo-lists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todoListsAPI, UpdateTaskModelType} from '../api/todo-lists-a-p-i'
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";


const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
  switch (action.type) {
    case "SET-TODOLISTS":

      // return action.todoLists.reduce((newState, todo) => {
      //   newState[todo.id] = []
      //   return newState
      // }, {...state})

      return Object.fromEntries(action.todoLists.map(todo => [todo.id, []]));
    case "SET-TASK":
      return {
        ...state,
        [action.todolistId]: action.tasks
      }
    case 'REMOVE-TASK':
      return {
        ...state, [action.todolistId]: state[action.todolistId].filter(task => task.id !== action.taskId)
      }
    case 'ADD-TASK':
      return {
        ...state,
        [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
      }
    case "UPDATE-TASK":
      return {
        ...state, [action.todolistId]: state[action.todolistId].map(task =>
           task.id === action.taskId ? {...task, ...action.model} : task
        )
      }
    case 'ADD-TODOLIST':
      return {
        ...state,
        [action.todoList.id]: []
      }
    case 'REMOVE-TODOLIST':
      const {[action.id]: [], ...rest} = state
      return rest
    default:
      return state;
  }
}

//actions creator
export const removeTaskAC = (taskId: string, todolistId: string) => ({
  type: 'REMOVE-TASK',
  taskId: taskId,
  todolistId: todolistId
} as const)
export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task}) as const
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) => ({
  type: 'UPDATE-TASK',
  model,
  todolistId,
  taskId
} as const)
export const setTaskAC = (tasks: TaskType[], todolistId: string) => ({type: 'SET-TASK', tasks, todolistId} as const)


// thunks creator
export const getTaskTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
  todoListsAPI.getTasks(todolistId).then(res => {
    dispatch(setTaskAC(res.data.items, todolistId))
  })
}
export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch<ActionsType>) => {
  todoListsAPI.deleteTask(todolistId, taskId).then(res => {
    dispatch(removeTaskAC(taskId, todolistId))
  })
}
export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch<ActionsType>) => {
  todoListsAPI.createTask(todolistId, title)
     .then(res => dispatch(addTaskAC(res.data.data.item)))
}
export const updateTaskTC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
   (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
     const task = getState().tasks[todolistId].find(task => task.id === taskId)

     if (task) {
       const apiModel: UpdateTaskModelType = {
         title: task.title,
         startDate: task.startDate,
         priority: task.priority,
         deadline: task.deadline,
         description: task.description,
         status: task.status,
         ...model
       }
       todoListsAPI.updateTask(todolistId, taskId, apiModel)
          .then(res =>
             dispatch(updateTaskAC(taskId, model, todolistId)))
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
type ActionsType =
   ReturnType<typeof removeTaskAC>
   | ReturnType<typeof addTaskAC>
   | ReturnType<typeof updateTaskAC>
   | AddTodolistActionType
   | RemoveTodolistActionType
   | SetTodoListsActionType
   | ReturnType<typeof setTaskAC>
