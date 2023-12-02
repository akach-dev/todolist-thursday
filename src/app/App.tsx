import React, {useEffect} from 'react'
import './App.css'
import {TodolistsList} from '../features/TodolistsList/TodolistsList'
import {useAppDispatch, useAppSelector} from './store'
import {me, RequestStatusType} from './app-reducer'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LogoutSharpIcon from '@mui/icons-material/LogoutSharp';
import Container from '@mui/material/Container';
import LinearProgress from '@mui/material/LinearProgress';
import {Menu} from '@mui/icons-material';
import {ErrorSnackbar} from '../components/ErrorSnackbar/ErrorSnackbar'
import FirstPageSharpIcon from '@mui/icons-material/FirstPageSharp';
import {Navigate, Route, Routes, useNavigate} from "react-router-dom";
import {Login} from "../features/Login/Login";
import {CircularProgress} from "@mui/material";
import {selectIsInitialized} from "./app-selectors";
import {selectorIsLoggedIn} from "../features/Login/auth-selectors";
import {logOut} from "../features/Login/auth-reducer";


function App() {
  const status = useAppSelector<RequestStatusType>((state) => state.app.status)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const isInitialized = useAppSelector(selectIsInitialized)
  const isLoggedIn = useAppSelector(selectorIsLoggedIn)


  useEffect(() => {
    dispatch(me())
  }, []);

  if (!isInitialized) {
    return <div
       style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
      <CircularProgress/>
    </div>
  }


  const logOutHandler = () => {
    dispatch(logOut())
  };
  return (
     <div className="App">
       <ErrorSnackbar/>
       <AppBar position="static">
         <Toolbar>
           <IconButton edge="start" color="inherit" aria-label="menu">
             <Menu/>
           </IconButton>
           <Typography variant="h6">
             News
           </Typography>
           {isLoggedIn && <Button onClick={logOutHandler} color="inherit"><LogoutSharpIcon/></Button>}
         </Toolbar>
         {status === 'loading' && <LinearProgress/>}
       </AppBar>
       <Container fixed>
         <Routes>
           <Route path={'/'} element={<TodolistsList/>}/>
           <Route path={'/login'} element={<Login/>}/>
           <Route path={'/404'} element={<>
             <h1 style={{textAlign: "center"}}>Page not found</h1>
             <button
                onClick={() => navigate('/')}
                style={{cursor: "pointer", textAlign: "center", display: "flex", alignItems: "center"}}>
               Home
               <FirstPageSharpIcon/>
             </button>
           </>}/>
           <Route path={'*'} element={<Navigate to={'/404'}/>}/>
         </Routes>
       </Container>
     </div>
  )
}

export default App
