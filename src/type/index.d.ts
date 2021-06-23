import { Auth } from "@app/data/user";

declare module Express {
  export interface Request {
    user: Auth;
  }
}

declare module "cloudinary" {
  export function config(conf: ConfigOptions);
}
