import React, {useEffect, useState} from 'react'
import axios from "axios";
import {todoListsApi} from "../api/todolists-api";

export default {
  title: 'API'
}


export const GetTodoLists = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    todoListsApi.getTodoLists().then(response => setState(response.data))

  }, [])
  return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {
    todoListsApi.createTodoList('React')
       .then(response => setState(response.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
  const [state, setState] = useState<any>(null)
  useEffect(() => {

    const ID = 'bc6a43ef-feb8-43f9-8578-28ca01606a6a'
    todoListsApi.deleteTodoLIst(ID)
       .then(response => setState(response.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
  const [state, setState] = useState<any>(null)

  const ID = '2741e2e2-9aac-4dc5-aea0-38bdc941782b'
  useEffect(() => {
    todoListsApi.updateTodoLIstTitle(ID, 'React')
       .then(response => setState(response.data))
  }, [])

  return <div>{JSON.stringify(state)}</div>
}


