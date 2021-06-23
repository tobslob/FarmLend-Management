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
import { BaseController, validate } from "@app/data/util";
import { secure } from "@app/common/services/jsonwebtoken"
import { Books } from "@app/services/book";
import { isUpload } from "./book.middleware";
import { isBook } from "./book.validator";

type ControllerResponse = Book | Book[];

@controller("/books")
export class BookController extends BaseController<ControllerResponse> {
  @httpPost("/", secure, isUpload, validate(isBook))
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

  @httpGet("/feature", secure)
  async getFeatureBooks(
    @request() req: Request,
    @response() res: Response
  ) {
    try {
      const query = { limit: 20 }
      const book = await Books.getBooks(query);
      this.handleSuccess(req, res, book);
    }catch(error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet("/like/:id", secure)
  async likeBook(
    @request() req: Request,
    @response() res: Response,
    @requestParam("id") id: string
  ) {
    try {
      const book = await Books.likeBook(id);
      this.handleSuccess(req, res, book);
    }catch(error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet("/remove/like/:id", secure)
  async removeLikeFromBook(
    @request() req: Request,
    @response() res: Response,
    @requestParam("id") id: string
  ) {
    try {
      const book = await Books.removeLikeFromBook(id);
      this.handleSuccess(req, res, book);
    }catch(error) {
      this.handleError(req, res, error);
    }
  }
}
