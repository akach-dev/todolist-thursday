import React, {useCallback, useEffect} from 'react'
import './App.css';
import {Todolist} from '../features/Todolist';
import {AddItemForm} from '../components/AddItemForm';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import {Menu} from '@mui/icons-material';
import {
  addTodolistAC,
  changeTodolistFilterAC,
  changeTodolistTitleAC, createTodolistTC, deleteTodoListTC, fetchTodoListsTC,
  FilterValuesType,
  removeTodolistAC,
  TodolistDomainType, updateTodoListTC
} from '../state/todo-lists-reducer'
import {
  addTaskAC,
  addTaskTC,
  deleteTaskTC,
  removeTaskAC, updateTaskTC
} from '../state/tasks-reducer';
import {useAppDispatch, useAppSelector} from '../state/store';
import {TaskStatuses, TaskType, todoListsAPI} from '../api/todo-lists-a-p-i'
import {LinearProgress} from "@mui/material";
import {ErrorSnackBar} from "../components/ErrorSnackBar/ErrorSnackBar";
import {StatusType} from "./app-reducer";


export type TasksStateType = {
  [key: string]: Array<TaskType>
}
type PropsType = {
  demo?: boolean
}


function App({demo = false}: PropsType) {

  const todoLists = useAppSelector<Array<TodolistDomainType>>(state => state.todoLists)
  const tasks = useAppSelector<TasksStateType>(state => state.tasks)
  const status = useAppSelector<StatusType>(state => state.app.status)
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (demo) {
      return;
    }
    dispatch(fetchTodoListsTC())
  }, []);

  const removeTask = useCallback((id: string, todolistId: string) => {
    dispatch(deleteTaskTC(todolistId, id));
  }, []);
  const addTask = useCallback((title: string, todolistId: string) => {
    dispatch(addTaskTC(todolistId, title));
  }, []);
  const changeStatus = useCallback((id: string, status: TaskStatuses, todolistId: string) => {
    dispatch(updateTaskTC(id, {status}, todolistId));
  }, []);
  const changeTaskTitle = useCallback((id: string, title: string, todolistId: string) => {
    const action = updateTaskTC(id, {title}, todolistId);
    dispatch(action);
  }, []);
  const changeFilter = useCallback((value: FilterValuesType, todolistId: string) => {
    const action = changeTodolistFilterAC(todolistId, value);
    dispatch(action);
  }, []);
  const removeTodolist = useCallback((id: string) => {
    dispatch(deleteTodoListTC(id));
  }, []);
  const changeTodolistTitle = useCallback((id: string, title: string) => {
    dispatch(updateTodoListTC(id, title));
  }, []);
  const addTodolist = useCallback((title: string) => {
    dispatch(createTodolistTC(title));
  }, [dispatch]);

  return (
     <div className="App">
       <ErrorSnackBar/>
       <AppBar position="static">
         <Toolbar>
           <IconButton edge="start" color="inherit" aria-label="menu">
             <Menu/>
           </IconButton>
           <Typography variant="h6">
             News
           </Typography>
           <Button color="inherit">Login</Button>
         </Toolbar>
         {status === "loading" && <LinearProgress/>}
       </AppBar>
       <Container fixed>
         <Grid container style={{padding: '20px'}}>
           <AddItemForm addItem={addTodolist}/>
         </Grid>
         <Grid container spacing={3}>
           {
             todoLists.map(tl => {
               let allTodolistTasks = tasks[tl.id];

               return <Grid item key={tl.id}>
                 <Paper style={{padding: '10px'}}>
                   <Todolist
                      todoList={tl}
                      tasks={allTodolistTasks}
                      removeTask={removeTask}
                      changeFilter={changeFilter}
                      addTask={addTask}
                      changeTaskStatus={changeStatus}
                      removeTodolist={removeTodolist}
                      changeTaskTitle={changeTaskTitle}
                      changeTodolistTitle={changeTodolistTitle}
                   />
                 </Paper>
               </Grid>
             })
           }
         </Grid>
       </Container>
     </div>
  );
}

export default App;
