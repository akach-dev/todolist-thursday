import axios, {AxiosResponse} from "axios";
import {ResponseType} from "./todolists-api";

const instance = axios.create({
  baseURL: 'https://social-network.samuraijs.com/api/1.1/',
  withCredentials: true,
})

export type LoginParamsType = {
  email: string
  password: string
  rememberMe: boolean
  captcha?: boolean
}
export type UserType = {
  id: number
  email: string
  login: string
}


export const authAPI = {
  login(data: LoginParamsType) {
    return instance.post<null, AxiosResponse<ResponseType<{ userId: number }>>, LoginParamsType>('auth/login', data)
  },
  me() {
    return instance.get<ResponseType<UserType>>('auth/me')
  },
  logout() {
    return instance.delete<ResponseType>('auth/login')
  }

}
