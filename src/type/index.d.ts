import { Auth } from "@app/data/user";

declare module 'express' {
  export interface Request {
    user: Auth;
    file: any;
    files: any;
  }
}

declare module "cloudinary" {
  export function config(conf: ConfigOptions);
}
