import {
  controller,
  httpPost,
  request,
  response,
  requestBody,
} from 'inversify-express-utils'
import { BaseController } from '@app/data/util'
import { User, UserDTO, LoginDTO } from '@app/data/user'
import { Users } from '@app/services/user'
import { Request, Response } from 'express'

type controllerResponse = User | User[] | string;

@controller('/users')
export class UserController extends BaseController<controllerResponse> {
  @httpPost('/')
  async createUser(
    @request() req: Request,
    @response() res: Response,
    @requestBody() body: UserDTO,
  ) {
    try {
      const user = await Users.createUser(body)
      this.handleSuccess(req, res, user)
    } catch (error) {
      this.handleError(req, res, error)
    }
  }

  @httpPost('/login')
  async login(
    @request() req: Request,
    @response() res: Response,
    @requestBody() body: LoginDTO,
  ) {
    try {
      const user = await Users.login(body)
      this.handleSuccess(req, res, user)
    } catch (error) {
      this.handleError(req, res, error)
    }
  }
}
