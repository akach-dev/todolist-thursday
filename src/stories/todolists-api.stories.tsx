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

