import {
  controller,
  httpPost,
  requestBody,
  request,
  response,
} from "inversify-express-utils";
import { Request, Response } from "express";
import { Book, BookDTO } from "@app/data/book";
import { BaseController } from "@app/data/util";
import { secure } from "@app/common/services"

type ControllerResponse = Book | Book[];

@controller("/Books")
export class UserBookController extends BaseController<ControllerResponse> {
  @httpPost("/", secure)
  async createBook(
    @request() req: Request,
    @response() res: Response,
    @requestBody() body: BookDTO
  ) {
  }
}
