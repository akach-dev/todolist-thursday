import React, {useEffect, useState} from 'react'
import axios from "axios";

export default {
  title: 'API'
}

const config = {
  withCredentials: true,
  headers: {
    'API-KEY': '6ff77210-e71e-46ba-98fd-7bb7e9655f9e'
  }
}

export const GetTodolists = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
   axios.get('https://social-network.samuraijs.com/api/1.1/todo-lists',  config )
      .then(res => {
        setState(res.data)
      })
  }, [])
  return <div>{JSON.stringify(state)}</div>
}

export const CreateTodolist = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    axios.post('https://social-network.samuraijs.com/api/1.1/todo-lists',  {title: 'Alex TodoList'}  ,config )
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
    axios.delete(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todoListID}`,    config )
       .then(res => {
         setState(res.data)
       })
  }, [])

  return <div>{JSON.stringify(state)}</div>
}

export const UpdateTodolistTitle = () => {
  const [state, setState] = useState<any>(null)

  const todoListID = '61a9308-3379-41f5-930f-bbdf2ed3ee1a'

  useEffect(() => {
    axios.put(`https://social-network.samuraijs.com/api/1.1/todo-lists/${todoListID}`,
       {title: 'Update TodoList'}  ,config )
       .then(res => {
         setState(res.data)
       })
  }, [])

  return <div>{JSON.stringify(state)}</div>
}
