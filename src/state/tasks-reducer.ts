import {TasksStateType} from '../App';
import {v1} from 'uuid';
import {
  AddTodolistActionType,
  RemoveTodolistActionType,
  setTodoListsAC,
  SetTodoListsActionType
} from './todolists-reducer';
import {TaskPriorities, TaskStatuses, TaskType, todoListsAPI, UpdateTaskModelType} from '../api/todo-lists-a-p-i'
import {Dispatch} from "redux";
import {AppRootStateType} from "./store";

export type RemoveTaskActionType = {
  type: 'REMOVE-TASK',
  todolistId: string
  taskId: string
}

export type AddTaskActionType = ReturnType<typeof addTaskAC>

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

export type SetTaskActionType = ReturnType<typeof setTaskAC>

type ActionsType = RemoveTaskActionType | AddTaskActionType
   | ChangeTaskStatusActionType
   | ChangeTaskTitleActionType
   | AddTodolistActionType
   | RemoveTodolistActionType
   | SetTodoListsActionType
   | SetTaskActionType

const initialState: TasksStateType = {
  /*"todolistId1": [
      { id: "1", title: "CSS", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
          startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
      { id: "2", title: "JS", status: TaskStatuses.Completed, todoListId: "todolistId1", description: '',
          startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
      { id: "3", title: "React", status: TaskStatuses.New, todoListId: "todolistId1", description: '',
          startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
  ],
  "todolistId2": [
      { id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
          startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
      { id: "2", title: "milk", status: TaskStatuses.Completed, todoListId: "todolistId2", description: '',
          startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low },
      { id: "3", title: "tea", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
          startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low }
  ]*/
}

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
    case 'REMOVE-TASK': {
      return {
        ...state, [action.todolistId]: state[action.todolistId].filter(task => task.id !== action.taskId)
      }
    }
    case 'ADD-TASK': {
      return {
        ...state,
        [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
      }
    }
    case 'CHANGE-TASK-STATUS': {
      return {
        ...state, [action.todolistId]: state[action.todolistId].map(task =>
           task.id === action.taskId ? {...task, status: action.status} : task
        )
      }
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

export const removeTaskAC = (taskId: string, todolistId: string): RemoveTaskActionType => {
  return {type: 'REMOVE-TASK', taskId: taskId, todolistId: todolistId}
}
export const addTaskAC = (task: TaskType) => ({type: 'ADD-TASK', task}) as const
export const changeTaskStatusAC = (taskId: string, status: TaskStatuses, todolistId: string): ChangeTaskStatusActionType => {
  return {type: 'CHANGE-TASK-STATUS', status, todolistId, taskId}
}
export const changeTaskTitleAC = (taskId: string, title: string, todolistId: string): ChangeTaskTitleActionType => {
  return {type: 'CHANGE-TASK-TITLE', title, todolistId, taskId}
}
export const setTaskAC = (tasks: TaskType[], todolistId: string) => {
  return {type: 'SET-TASK', tasks, todolistId} as const
}


// thunk creator
export const getTaskTC = (todolistId: string) => (dispatch: Dispatch) => {
  todoListsAPI.getTasks(todolistId).then(res => {
    dispatch(setTaskAC(res.data.items, todolistId))
  })
}
export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: Dispatch) => {
  todoListsAPI.deleteTask(todolistId, taskId).then(res => {
    dispatch(removeTaskAC(taskId, todolistId))
  })
}
export const addTaskTC = (todolistId: string, title: string) => (dispatch: Dispatch) => {
  todoListsAPI.createTask(todolistId, title)
     .then(res => dispatch(addTaskAC(res.data.data.item)))
}
export const updateTaskStatusTC = (taskId: string, status: TaskStatuses, todolistId: string) => {
  return (dispatch: Dispatch, getState: () => AppRootStateType) => {
    const task = getState().tasks[todolistId].find(task => task.id === taskId)

    if (task) {
      const model: UpdateTaskModelType = {
        title: task.title,
        startDate: task.startDate,
        priority: task.priority,
        deadline: task.deadline,
        description: task.description,
        status
      }
      todoListsAPI.updateTask(todolistId, taskId, model)
         .then(res =>
            dispatch(changeTaskStatusAC(taskId, status, todolistId)))
    }

  }
}