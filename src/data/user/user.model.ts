import { Model } from "../database";

export interface User extends Model {
  first_name: string;
  last_name: string;
  email_address: string;
  location: string;
  password: string;
}

export interface UserDTO {
  first_name: string;
  last_name: string;
  email_address: string;
  location: string;
  password: string;
}

export interface LoginDTO {
  email_address: string;
  password: string;
}

export interface Auth extends User {
  token: string;
}
