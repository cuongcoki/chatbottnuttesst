import { IBaseEntity1, UserRole } from "./IEnum";

export interface IUser extends IBaseEntity1 {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  full_name: string;
  avatar?: string;
  phone?: string;
  is_active: boolean;
}