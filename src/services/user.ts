import { UserDTO, LoginDTO, User } from "@app/data/models";
import { userRepo } from "@app/data/repositories/user.repo";
import { Passwords } from "./password";
import { seal } from "@app/common/services/jsonwebtoken";
import { config } from "dotenv";
import { NotFoundError, UnAuthorisedError } from "@app/data/util";
import db from "@app/data/database/connect";
import { Organizations } from "./organization";
import { orgRepo } from "@app/data/repositories/organization.repo";

config();

class UserService {
  constructor() {}

  async createUser(user: UserDTO) {
    let usr: User;
    await db.sequelize.transaction().then(async t => {
      return await Organizations.createOrganization(
        {
          name: user.organizationName,
          type: user.organizationType
        },
        { ...t }
      )
        .then(async organization => {
          usr = await userRepo.create(
            {
              ...user,
              // @ts-ignore
              organizationId: organization.id,
              // @ts-ignore
              organizationName: organization.organizationName,
              // @ts-ignore
              organizationType: organization.organizationType
            },
            { ...t }
          );
        })
        .then(t.commit.bind(t))
        .catch(error => {
          t.rollback.bind(t);
          throw new Error(error?.original);
        });
    });
    return usr;
  }

  async addUserToOrganization(user: UserDTO) {
    if (user.organizationId) {
      const org = (await orgRepo.findById(user?.organizationId)).toJSON();
      if (!org) {
        throw new NotFoundError("Invalid organization id");
      }
    }
    return await userRepo.create(user);
  }

  async getUser(id: string) {
    try {
      return (await userRepo.findById(id)).toJSON();
    } catch (error) {
      throw new Error(error?.original);
    }
  }

  async login(login: LoginDTO) {
    try {
      const user = await userRepo.findOne(login.emailAddress);

      const isCorrectPassword = await Passwords.validate(
        login.password,
        // @ts-ignore
        user.toJSON()?.password
      );

      if (!isCorrectPassword) {
        throw new UnAuthorisedError("Incorrecr email address or password.");
      }
      return seal(user, process.env.SECRET_KEY, "24h");
    } catch (error) {
      throw new Error(error?.original);
    }
  }
}

export const Users = new UserService();
