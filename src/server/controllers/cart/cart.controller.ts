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

@controller("/carts", secure)
export class CartController extends BaseController<ControllerResponse> {
  @httpPost("/")
  async addToCart(
    @request() req: Request,
    @response() res: Response,
    @requestBody() body: CartDTO
  ) {
    try {
      const cart = await Carts.createCart(body.book_id, req)
      this.handleSuccess(req, res, cart)
    }catch(error) {
      this.handleError(req, res, error);
    }
  }

  @httpPost("/increment/:id")
  async incrementCart(
    @request() req: Request,
    @response() res: Response,
    @requestParam("id") id: string
  ) {
    try {
      const cart = await Carts.incrementCart(id, req);
      this.handleSuccess(req, res, cart);
    }catch(error) {
      this.handleError(req, res, error);
    }
  }

  @httpPost("/decrement/:id")
  async decrementBookInCart(
    @request() req: Request,
    @response() res: Response,
    @requestParam("id") id: string
  ) {
    try {
      const cart = await Carts.decrementCart(id, req);
      this.handleSuccess(req, res, cart);
    }catch(error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet("/")
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

  @httpGet("/:id")
  async getCart(
    @request() req: Request,
    @response() res: Response,
    @requestParam("id") id: string
  ) {
    try {
      const cart = await Carts.getCart(id, req)
      this.handleSuccess(req, res, cart)
    }catch(error) {
      this.handleError(req, res, error);
    }
  }

  @httpDelete("/:id")
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
