import {instance, ResponseType} from "./todolists-api";
import {AxiosResponse} from "axios";

export class AuthApi {
  static login(data: LoginParams) {
    return instance.post<null, AxiosResponse<ResponseType<{ userId: number }>, LoginParams>>('auth/login', data)
  }

  static me() {
    return instance.get<ResponseType<User>>('auth/me')
  }

  static logOut() {
    return instance.delete<ResponseType>('auth/login')
  }
}

export type LoginParams = {
  email: string
  password: string
  rememberMe: boolean
  captcha?: boolean
}
type User = {
  id: number
  email: string
  login: string

}