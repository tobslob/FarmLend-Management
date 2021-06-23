import {
  controller,
  httpPost,
  requestBody,
  request,
  response,
  httpGet,
  queryParam,
  requestParam
} from "inversify-express-utils";
import { Request, Response } from "express";
import { Book, BookDTO, BookQuery } from "@app/data/book";
import { BaseController } from "@app/data/util";
import { secure } from "@app/common/services/jsonwebtoken"
import { Books } from "@app/services/book";
import { isUpload } from "./book.middleware";

type ControllerResponse = Book | Book[];

@controller("/books")
export class UserBookController extends BaseController<ControllerResponse> {
  @httpPost("/", secure, isUpload)
  async addBook(
    @request() req: Request,
    @response() res: Response,
    @requestBody() body: BookDTO
  ) {
    try {
      const book = await Books.addBook(body, req, res);
      this.handleSuccess(req, res, book);
    }catch(error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet("/:id", secure)
  async getBook(
    @request() req: Request,
    @response() res: Response,
    @requestParam("id") id: string
  ) {
    try {
      const book = await Books.getBook(id);
      this.handleSuccess(req, res, book);
    }catch(error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet("/", secure)
  async getBooks(
    @request() req: Request,
    @response() res: Response,
    @queryParam() query: BookQuery
  ) {
    try {
      const book = await Books.getBooks(query);
      this.handleSuccess(req, res, book);
    }catch(error) {
      this.handleError(req, res, error);
    }
  }
}
