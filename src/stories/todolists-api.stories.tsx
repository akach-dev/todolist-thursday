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
