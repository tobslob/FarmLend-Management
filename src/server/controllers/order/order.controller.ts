import { OrderDTO, Order, QueryDTO } from '@app/data/models';
import { BaseController, validate } from '@app/data/util';
import {
  controller,
  httpDelete,
  httpGet,
  httpPatch,
  httpPost,
  queryParam,
  request,
  requestBody,
  requestParam,
  response,
} from 'inversify-express-utils';
import { Request, Response } from 'express';
import { isOrder, isQuery } from './order.validator';
import { Orders } from '@app/services/order';
import { isID } from '../user/user.validator';
import { secure } from '@app/common/services/jsonwebtoken';

type controllerResponse = Order | Order[] | object | number;

@controller('/orders', secure)
export class OrderController extends BaseController<controllerResponse> {
  @httpPost('/', validate(isOrder))
  async createOrder(@request() req: Request, @response() res: Response, @requestBody() body: OrderDTO) {
    try {
      const order = await Orders.createOrder(body, req);
      this.handleSuccess(req, res, order);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet('/', validate(isQuery))
  async getOrders(@request() req: Request, @response() res: Response, @queryParam() query: QueryDTO) {
    try {
      const orders = await Orders.getOrders(query, req);
      this.handleSuccess(req, res, orders);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet('/:id', validate(isID))
  async getOrder(@request() req: Request, @response() res: Response, @requestParam('id') id: string) {
    try {
      const order = await Orders.getOrderById(id);
      this.handleSuccess(req, res, order);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpDelete('/:id', validate(isID))
  async deleteOrder(@request() req: Request, @response() res: Response, @requestParam('id') id: string) {
    try {
      const resp = await Orders.deleteOrder(id, req);
      this.handleSuccess(req, res, resp);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpPatch('/:id', validate(isID), validate(isOrder))
  async updateOrder(
    @request() req: Request,
    @response() res: Response,
    @requestParam('id') id: string,
    @requestBody() body: OrderDTO,
  ) {
    try {
      const order = await Orders.updateOrder(id, body);
      this.handleSuccess(req, res, order);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
