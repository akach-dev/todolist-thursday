import {removeTaskAC, tasksReducer, TasksStateType, updateTaskAC} from "./tasks-reducer";
import {TaskPriorities, TaskStatuses} from "../../api/todolists-api";
import {removeTodolistAC} from "./todolists-reducer";

let startState: TasksStateType = {}

beforeEach(() => {
  startState = {
    'todoList1': [
      {
        todoListId: 'todoList1', title: 'CSS', status: TaskStatuses.New, id: '1',
        startDate: '', priority: TaskPriorities.Low, description: '', deadline: '', order: 0, addedDate: ''
      }, {
        todoListId: 'todoList1', title: 'JS', status: TaskStatuses.Completed, id: '2',
        startDate: '', priority: TaskPriorities.Low, description: '', deadline: '', order: 0, addedDate: ''
      }, {
        todoListId: 'todoList1', title: 'React', status: TaskStatuses.New, id: '3',
        startDate: '', priority: TaskPriorities.Low, description: '', deadline: '', order: 0, addedDate: ''
      },
    ],
    'todoList2': [
      {
        todoListId: 'todoList2', title: 'bread', status: TaskStatuses.New, id: '1', startDate: '',
        priority: TaskPriorities.Low, description: '', deadline: '', order: 0, addedDate: ''
      }, {
        todoListId: 'todoList2', title: 'milk', status: TaskStatuses.Completed, id: '2',
        startDate: '', priority: TaskPriorities.Low, description: '', deadline: '', order: 0, addedDate: ''
      }, {
        todoListId: 'todoList2', title: 'tea', status: TaskStatuses.New, id: '3',
        startDate: '', priority: TaskPriorities.Low, description: '', deadline: '', order: 0, addedDate: ''
      },
    ]
  }
})

test('correct task should be delete from correct array ', () => {
  const state =
     tasksReducer(startState, removeTaskAC({taskId: '2', todolistId: 'todoList1'}))

  expect(state['todoList1'].length).toBe(2)
  expect(state['todoList2'].length).toBe(3)
  expect(state['todoList1'][1].title).toBe('React')
})
test('status of specified task should be changed', () => {
  const state =
     tasksReducer(startState,
        updateTaskAC({taskId: '2', todolistId: 'todoList2', model: {status: TaskStatuses.New}}))

  expect(state['todoList2'][1].status).toBe(TaskStatuses.New)
  expect(state['todoList1'][1].status).toBe(TaskStatuses.Completed)
})
test('property with todoListId should be delete', () => {
  const state = tasksReducer(startState, removeTodolistAC({id: 'todoList2'}))
  const keys = Object.keys(state)
  expect(keys.length).toBe(1)
  expect(state['todoList2']).toBeUndefined()
})

