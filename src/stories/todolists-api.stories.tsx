import React, {useEffect, useState} from 'react'
import axios from "axios";
import {todoListsApi} from "../api/todolists-api";

export default {
  title: 'API'
}
export const GetTodoLists = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    todoListsApi.getTodoLists()
      .then(res => {
        setState(res.data)
      })
  }, [])
  return <div>{JSON.stringify(state)}</div>
}

export const CreateTodolist = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    todoListsApi.createTodoList('Alex TodoList')
       .then(res => {
         setState(res.data)
       })
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const DeleteTodolist = () => {
  const [state, setState] = useState<any>(null)

  const todoListID = '61a9308-3379-41f5-930f-bbdf2ed3ee1a'

  useEffect(() => {
    todoListsApi.deleteTodoLIst(todoListID)
       .then(res => {
         setState(res.data)
       })
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const UpdateTodolistTitle = () => {
  const [state, setState] = useState<any>(null)

  const todoListID = '5b6d6b63-62d4-4130-bccf-833edcf4c3e1'

  useEffect(() => {
    todoListsApi.updateTodoLIstTitle(todoListID, 'Update TodoList Title' )
       .then(res => {
         setState(res.data)
       })
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const GetTasks = () => {
  const [state, setState] = useState<any>(null)

  const todoListID = '5b6d6b63-62d4-4130-bccf-833edcf4c3e1'


  useEffect(() => {
    todoListsApi.getTasks(todoListID)
       .then(res => {
         setState(res.data)
       })
  }, [])
  return <div>{JSON.stringify(state)}</div>
}

export const DeleteTask = () => {
  const [state, setState] = useState<any>(null)

  const todoListID = '61a9308-3379-41f5-930f-bbdf2ed3ee1a'
  const taskID = '61a9308-3379-41f5-930f-bbdf2ed3ee1a'

  useEffect(() => {
    todoListsApi.deleteTask(todoListID, taskID)
       .then(res => {
         setState(res.data)
       })
  }, [])

  return <div>{JSON.stringify(state)}</div>
}


export const CreateTask = () => {
  const [state, setState] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [todoListId, setTodoListId] = useState('')


  const createTaskHandler = () => {
    todoListsApi.createTask(todoListId, title)
       .then(res => {
         setState(res.data)
       })
  };
  return <div>{JSON.stringify(state)}
    <div>
      <input type="text" placeholder={'todolistID'}
             value={todoListId} onChange={e => setTodoListId(e.currentTarget.value)}/>
      <input type="text" placeholder={'Task title'}
             value={title} onChange={e => setTitle(e.currentTarget.value)}/>
      <button onClick={createTaskHandler}>Create Task</button>
    </div>
  </div>
}

export const UpdateTask = () => {
  const [state, setState] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [taskId, setTaskId] = useState('')
  const [todoListId, setTodoListId] = useState('')
  const [description, setDescription] = useState('')
  const [completed, setCompleted] = useState(false)
  const [status, setStatus] = useState(0)
  const [priority, setPriority] = useState('')
  const [startDate, setStartDate] = useState('')
  const [deadline, setDeadline] = useState('')


  const createTaskHandler = () => {
    todoListsApi.updateTask(
       todoListId,
       taskId ,
       {title, description, completed, status, deadline, priority, startDate})
       .then(res => {
         setState(res.data)
       })
  };
  return <div>{JSON.stringify(state)}
    <div>
      <input type="text" placeholder={'todolistID'} value={todoListId} onChange={e => setTodoListId(e.currentTarget.value)}/>
      <input type="text" placeholder={'taskId'} value={taskId} onChange={e => setTaskId(e.currentTarget.value)}/>
      <input type="text" placeholder={'Task title'} value={title} onChange={e => setTitle(e.currentTarget.value)}/>
      <input type="text" placeholder={'Task description'} value={description} onChange={e => setDescription(e.currentTarget.value)}/>
      {/*<input type="text" placeholder={'Task completed'} checked={completed} onChange={e => setCompleted(e.currentTarget.checked)}/>*/}
      <input type="text" placeholder={'Task status'} value={status} onChange={e => setStatus(Number(e.currentTarget.value))}/>
      <input type="text" placeholder={'Task priority'} value={priority} onChange={e => setPriority(e.currentTarget.value)}/>
      <input type="text" placeholder={'Task startDate'} value={startDate} onChange={e => setStartDate(e.currentTarget.value)}/>
      <input type="text" placeholder={'Task deadline'} value={deadline} onChange={e => setDeadline(e.currentTarget.value)}/>

      <button onClick={createTaskHandler}>Update Task</button>
    </div>
  </div>
}