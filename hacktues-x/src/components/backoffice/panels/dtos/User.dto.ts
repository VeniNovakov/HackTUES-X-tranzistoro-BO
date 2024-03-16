import type { Company } from "./company.interface";
import type { Role } from "./role.interface";

export interface UserDTO{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: Company;
  role: Role;
}