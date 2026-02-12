import { IUser } from "./IUser";

export interface ILoginRequest {
  email: string;
  password: string;
}


export interface IAuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: IUser;
  }
}





