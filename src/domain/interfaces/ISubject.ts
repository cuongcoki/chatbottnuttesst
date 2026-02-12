import { IBaseEntity } from "./IEnum";

export interface ISubject extends IBaseEntity {
   id: string;
  name: string;
  code: string;
  description?: string;
  grade_levels: number[];
  is_active: boolean;
}