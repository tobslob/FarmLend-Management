import {
  controller,
  httpPost,
  requestBody,
  request,
  response,
  httpGet,
  requestParam,
  httpDelete
} from "inversify-express-utils";
import { Request, Response } from "express";
import { BaseController } from "@app/data/util";
import { secure } from "@app/common/services/jsonwebtoken";
import { Cart, CartDTO } from "@app/data/cart/cart.model";
import { Carts } from "@app/services/cart";

type ControllerResponse = Cart | Cart[];

@controller("/carts")
export class CartController extends BaseController<ControllerResponse> {
  @httpPost("/", secure)
  async addToCart(
    @request() req: Request,
    @response() res: Response,
    @requestBody() body: CartDTO
  ) {
    try {
      const cart = await Carts.createCart(body.bookId, req)
      this.handleSuccess(req, res, cart)
    }catch(error) {
      this.handleError(req, res, error);
    }
  }

  @httpPost("/increment", secure)
  async incrementCart(
    @request() req: Request,
    @response() res: Response,
    @requestBody() body: CartDTO
  ) {
    try {
      const cart = await Carts.incrementCart(body.bookId, req);
      this.handleSuccess(req, res, cart);
    }catch(error) {
      this.handleError(req, res, error);
    }
  }

  @httpPost("/decrement", secure)
  async decrementBookInCart(
    @request() req: Request,
    @response() res: Response,
    @requestBody() body: CartDTO
  ) {
    try {
      const cart = await Carts.decrementCart(body.bookId, req)
      this.handleSuccess(req, res, cart);
    }catch(error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet("/", secure)
  async getCarts(
    @request() req: Request,
    @response() res: Response
  ) {
    try {
      const carts = await Carts.getCarts(req)
      this.handleSuccess(req, res, carts)
    }catch(error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet("/:bookId", secure)
  async getCart(
    @request() req: Request,
    @response() res: Response,
    @requestParam("bookId") bookId: string
  ) {
    try {
      const cart = await Carts.getCart(bookId, req)
      this.handleSuccess(req, res, cart)
    }catch(error) {
      this.handleError(req, res, error);
    }
  }

  @httpDelete("/:bookId", secure)
  async removeCart(
    @request() req: Request,
    @response() res: Response,
    @requestParam("bookId") bookId: string
  ) {
    try {
      const cart = await Carts.removeFromCart(bookId, req)
      this.handleSuccess(req, res, cart)
    }catch(error) {
      this.handleError(req, res, error);
    }
  }
}
