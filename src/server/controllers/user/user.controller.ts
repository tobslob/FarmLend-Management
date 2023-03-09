import {
  controller,
  httpPost,
  request,
  response,
  requestBody,
  httpGet,
  requestParam
} from "inversify-express-utils";
import { BaseController, validate } from "@app/data/util";
import { Users } from "@app/services/user";
import { Request, Response } from "express";
import { isUser, isLogin, isID } from "./user.validator";
import { LoginDTO, User, UserDTO } from "@app/data/models";

type controllerResponse = User | User[] | object | string;

@controller("/users")
export class UserController extends BaseController<controllerResponse> {
  @httpPost("/", validate(isUser))
  async createUser(
    @request() req: Request,
    @response() res: Response,
    @requestBody() body: UserDTO
  ) {
    try {
      const user = body.organizationId
        ? await Users.addUserToOrganization(body)
        : await Users.createUser(body);
      this.handleSuccess(req, res, user);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet("/:id", validate(isID))
  async getUser(
    @request() req: Request,
    @response() res: Response,
    @requestParam("id") id: string
  ) {
    try {
      const user = await Users.getUser(id);
      this.handleSuccess(req, res, user);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpPost("/login", validate(isLogin))
  async login(@request() req: Request, @response() res: Response, @requestBody() body: LoginDTO) {
    try {
      const user = await Users.login(body);
      this.handleSuccess(req, res, user);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
