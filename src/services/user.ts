import { UserRepo, UserDTO, User, LoginDTO } from '@app/data/user'
import { Passwords } from './password'
import { UnAuthorisedError } from '@app/data/util'
import { seal } from '@app/common/services/jsonwebtoken'
import { config } from 'dotenv'

config()

class UserService {
  constructor() {}

  async createUser(user: UserDTO): Promise<User> {
    const password = await Passwords.generateHash(user.password)

    return await UserRepo.create({
      first_name: user.first_name,
      last_name: user.last_name,
      email_address: user.email_address,
      location: user.location,
      password,
    })
  }

  async getUser(id: string): Promise<User> {
    return await UserRepo.byID(id)
  }

  async login(login: LoginDTO): Promise<string> {
    const user = await UserRepo.byQuery({ email_address: login.email_address }, false)

    const isCorrectPassword = await Passwords.validate(
      login.password,
      user.password,
    )

    if (!isCorrectPassword) {
      throw new UnAuthorisedError('Incorrecr email address or password.')
    }

    return seal(user, process.env.SECRET_KEY, '2h')
  }
}

export const Users = new UserService()
