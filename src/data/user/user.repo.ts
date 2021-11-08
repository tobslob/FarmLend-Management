import { User } from "./user.model";
import { BaseRepository } from "../database";
import { connection } from "mongoose";
import { UserSchema } from "./user.schema";

class UserRepository extends BaseRepository<User> {
  constructor() {
    super(connection, "User", UserSchema);
  }
}

export const UserRepo = new UserRepository();
