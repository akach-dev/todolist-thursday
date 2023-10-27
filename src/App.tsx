import React, {useCallback, useEffect} from 'react'
import './App.css';
import {Todolist} from './Todolist';
import {AddItemForm} from './AddItemForm';
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
  TodolistDomainType
} from './state/todolists-reducer'
import {
  addTaskAC,
  addTaskTC,
  changeTaskStatusAC,
  changeTaskTitleAC,
  deleteTaskTC,
  removeTaskAC, updateTaskStatusTC
} from './state/tasks-reducer';
import {useAppDispatch, useAppSelector} from './state/store';
import {TaskStatuses, TaskType, todoListsAPI} from './api/todo-lists-a-p-i'


export type TasksStateType = {
  [key: string]: Array<TaskType>
}

function App() {

  const todoLists = useAppSelector<Array<TodolistDomainType>>(state => state.todoLists)
  const tasks = useAppSelector<TasksStateType>(state => state.tasks)
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchTodoListsTC())
  }, []);

  const removeTask = useCallback((id: string, todolistId: string) => {
    dispatch(deleteTaskTC(todolistId, id));
  }, []);
  const addTask = useCallback((title: string, todolistId: string) => {
    dispatch(addTaskTC(todolistId, title));
  }, []);
  const changeStatus = useCallback((id: string, status: TaskStatuses, todolistId: string) => {
    dispatch(updateTaskStatusTC(id, status, todolistId));
  }, []);
  const changeTaskTitle = useCallback((id: string, newTitle: string, todolistId: string) => {
    const action = changeTaskTitleAC(id, newTitle, todolistId);
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
    const action = changeTodolistTitleAC(id, title);
    dispatch(action);
  }, []);
  const addTodolist = useCallback((title: string) => {
    dispatch(createTodolistTC(title));
  }, [dispatch]);

  return (
     <div className="App">
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
                      id={tl.id}
                      title={tl.title}
                      tasks={allTodolistTasks}
                      removeTask={removeTask}
                      changeFilter={changeFilter}
                      addTask={addTask}
                      changeTaskStatus={changeStatus}
                      filter={tl.filter}
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
