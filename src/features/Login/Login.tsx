import React from 'react'
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {useFormik} from "formik";
import * as yup from 'yup';
import {useAppDispatch, useAppSelector} from "../../app/store";
import {login} from "./auth-reducer";
import {selectorIsLoggedIn} from "./auth-selectors";
import {TasksStateType} from "../TodolistsList/tasks-reducer";
import {Navigate} from "react-router-dom";


const validationSchema = yup.object({
  email: yup
     .string()
     .email('Enter a valid email')
     .required('Email is required'),
  password: yup
     .string()
     .min(8, 'Password should be of minimum 8 characters length')
     .required('Password is required'),
});

export const Login = () => {
  const dispatch = useAppDispatch()
  const isLoggedIn = useAppSelector(selectorIsLoggedIn)


  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema,
    onSubmit: values => {
      // alert(JSON.stringify(values, null, 2));
      // formik.resetForm()
      dispatch(login(values))
    },
  });

  if (isLoggedIn) {
    return <Navigate to={'/'} replace/>
  }


  return <Grid container justifyContent={'center'}>
    <Grid item justifyContent={'center'}>
      <form onSubmit={formik.handleSubmit}>
        <FormControl>
          <FormLabel>
            <p>To log in get registered
              <a href={'https://social-network.samuraijs.com/'}
                 target={'_blank'}> here
              </a>
            </p>
            <p>or use common test account credentials:</p>
            <p>Email: free@samuraijs.com</p>
            <p>Password: free</p>
          </FormLabel>
          <FormGroup>
            <TextField label="Email" margin="normal"
                       {...formik.getFieldProps('email')}
                       onBlur={formik.handleBlur}
                       error={formik.touched.email && Boolean(formik.errors.email)}
                       helperText={formik.touched.email && formik.errors.email}
            />
            <TextField type="password" label="Password"
                       margin="normal"
                       {...formik.getFieldProps('password')}
                       onBlur={formik.handleBlur}
                       error={formik.touched.password && Boolean(formik.errors.password)}
                       helperText={formik.touched.password && formik.errors.password}
            />
            <FormControlLabel label={'Remember me'} control={<Checkbox
               {...formik.getFieldProps('rememberMe')}
            />}/>
            <Button type={'submit'} variant={'contained'} color={'primary'}>
              Login
            </Button>
          </FormGroup>
        </FormControl>
      </form>
    </Grid>
  </Grid>
}