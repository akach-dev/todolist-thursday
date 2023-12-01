import {instance, ResponseType} from "./todolists-api";
import {AxiosResponse} from "axios";

export class AuthApi {
  static logIn(data: any) {
    return instance.post<null, AxiosResponse<ResponseType<{ userId: number }>>>('auth/login', data)
  }

  static me() {
    return instance.get<ResponseType<{
      id: number
      email: string
      login: string
    }>>('auth/me')
  }
}