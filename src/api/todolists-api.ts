import axios from "axios";


const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1/',
  withCredentials: true,
  headers: {
    'API-KEY': '6ff77210-e71e-46ba-98fd-7bb7e9655f9e'
  }
})

export type TodoListType = {
  id: string;
  title: string;
  addedDate: Date;
  order: number;
}
type ResponseType<D = {}> = {
  resultCode: number
  messages: string[],
  data: D
}

export type UpdateTodoListResponseType = {
  data: {};
  messages: string[];
  fieldsErrors: string[];
  resultCode: number;
}

export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3
}

export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4
}

export type TaskType = {
  description: string
  title: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
  id: string
  todoListId: string
  order: number
  addedDate: string
}
type GetTasksResponseType = {
  error: string | null
  items: TaskType[]
  totalCount: number
}
type UpdateTaskType = {
  title: string
  description: string
  completed: boolean
  status: number
  priority: string
  startDate: string
  deadline: string
}


export const todoListsApi = {
  getTodoLists() {
    return instance.get<TodoListType[]>('todo-lists')
  },
  createTodoList(title: string) {
    return instance.post<ResponseType<{ item: TodoListType }>>('todo-lists', {title})
  },
  deleteTodoLIst(todoListID: string) {
    return instance.delete<ResponseType>(`todo-lists/${todoListID}`)
  },
  updateTodoLIstTitle(todoListID: string, title: string) {
    return instance.put<UpdateTodoListResponseType>(`todo-lists/${todoListID}`,
       {title})
  },
  getTasks(todoListID: string) {
    return instance.get<GetTasksResponseType>(`todo-lists/${todoListID}/tasks`)
  },
  deleteTask(todoListID: string, taskID: string) {
    return instance.delete<ResponseType>(`todo-lists/${todoListID}/tasks/${taskID}`)
  },
  createTask(todoListID: string, title: string) {
    return instance.post<ResponseType<TaskType>>(`todo-lists/${todoListID}/tasks `, {title})
  },
  updateTask(todoListID: string, taskID: string, data: UpdateTaskType) {
    return instance.put<ResponseType<TaskType>>(`todo-lists/${todoListID}/tasks/${taskID} `, data)
  }
}
