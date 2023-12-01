import React, {useEffect} from 'react'
import './App.css'
import {TodolistsList} from '../features/TodolistsList/TodolistsList'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import {Menu} from '@mui/icons-material';
import {LinearLoader} from "../common/Loader/LinearLoader";
import {useAppDispatch, useAppSelector} from "./store";
import {selectAppIsInitialized, selectAppStatus} from "./app-selectors";
import {GlobalError} from "./GlobalError/GlobalError";
import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "../features/Login/Login";
import {me} from "../features/Login/auth-reducer";
import CircularProgress from "@mui/material/CircularProgress";


function App() {

  const status = useAppSelector(selectAppStatus)
  const isInitialized = useAppSelector(selectAppIsInitialized)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(me())
  }, []);

  if (!isInitialized) {
    return <div
       style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
      <CircularProgress/>
    </div>
  }


  return (
     <div className="App">
       <GlobalError/>
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
       {status === "loading" && <LinearLoader/>}
       <Container fixed>
         <Routes>
           <Route path={'/'} element={<TodolistsList/>}/>
           <Route path={'/login'} element={<Login/>}/>
           <Route path={'/404'} element={<h1 style={{textAlign: "center"}}>Page nof found</h1>}/>
           <Route path={'*'} element={<Navigate to={'/404'}/>}/>
         </Routes>
       </Container>
     </div>
  )
}

export default App
