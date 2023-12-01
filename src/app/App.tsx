import React from 'react'
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
import {useAppSelector} from "./store";
import {selectAppStatus} from "./app-selectors";
import {GlobalError} from "./GlobalError/GlobalError";


function App() {

  const status = useAppSelector(selectAppStatus)

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
         <TodolistsList/>
       </Container>
     </div>
  )
}

export default App
