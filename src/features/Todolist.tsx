import React, {useCallback, useEffect} from 'react'
import {AddItemForm} from '../components/AddItemForm'
import {EditableSpan} from '../components/EditableSpan'
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import {Delete} from '@mui/icons-material';
import {Task} from './Task'
import {FilterValuesType, TodolistDomainType} from '../state/todo-lists-reducer'
import {TaskStatuses, TaskType} from "../api/todo-lists-a-p-i";
import {useAppDispatch} from "../state/store";
import {getTaskTC} from "../state/tasks-reducer";

type PropsType = {
  todoList: TodolistDomainType
  tasks: Array<TaskType>
  changeFilter: (value: FilterValuesType, todolistId: string) => void
  addTask: (title: string, todolistId: string) => void
  changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
  changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
  removeTask: (taskId: string, todolistId: string) => void
  removeTodolist: (id: string) => void
  changeTodolistTitle: (id: string, newTitle: string) => void
  demo?: boolean
}

export const Todolist = React.memo(function ({todoList, demo = false, ...props}: PropsType) {

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (demo) {
      return;
    }
    dispatch(getTaskTC(todoList.id))
  }, []);

  const addTask = useCallback((title: string) => {
    props.addTask(title, todoList.id)
  }, [props.addTask, todoList.id])

  const removeTodolist = () => {
    props.removeTodolist(todoList.id)
  }
  const changeTodolistTitle = useCallback((title: string) => {
    props.changeTodolistTitle(todoList.id, title)
  }, [todoList.id, props.changeTodolistTitle])

  const onAllClickHandler = useCallback(() => props.changeFilter('all', todoList.id), [todoList.id, props.changeFilter])
  const onActiveClickHandler = useCallback(() => props.changeFilter('active', todoList.id), [todoList.id, props.changeFilter])
  const onCompletedClickHandler = useCallback(() => props.changeFilter('completed', todoList.id), [todoList.id, props.changeFilter])


  let tasksForTodolist = props.tasks

  if (todoList.filter === 'active') {
    tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.New)
  }
  if (todoList.filter === 'completed') {
    tasksForTodolist = props.tasks.filter(t => t.status === TaskStatuses.Completed)
  }

  return <div>
    <h3><EditableSpan value={todoList.title} onChange={changeTodolistTitle}/>
      <IconButton onClick={removeTodolist} disabled={todoList.entityStatus === "loading"}>
        <Delete/>
      </IconButton>
    </h3>
    <AddItemForm addItem={addTask} disabled={todoList.entityStatus === "loading"}/>
    <div>
      {
        tasksForTodolist.map(t => <Task key={t.id} task={t} todolistId={todoList.id}
                                        removeTask={props.removeTask}
                                        changeTaskTitle={props.changeTaskTitle}
                                        changeTaskStatus={props.changeTaskStatus}
        />)
      }
    </div>
    <div style={{paddingTop: '10px'}}>
      <Button variant={todoList.filter === 'all' ? 'outlined' : 'text'}
              onClick={onAllClickHandler}
              color={'inherit'}
      >All
      </Button>
      <Button variant={todoList.filter === 'active' ? 'outlined' : 'text'}
              onClick={onActiveClickHandler}
              color={'primary'}>Active
      </Button>
      <Button variant={todoList.filter === 'completed' ? 'outlined' : 'text'}
              onClick={onCompletedClickHandler}
              color={'secondary'}>Completed
      </Button>
    </div>
  </div>
})


