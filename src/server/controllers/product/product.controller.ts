import { ProductDTO, Product, QueryDTO } from '@app/data/models';
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
import { isProduct } from './product.validator';
import { products } from '@app/services/product';
import { isID } from '../user/user.validator';
import { isQuery } from '../order/order.validator';
import { secure } from '@app/common/services/jsonwebtoken';

type controllerResponse = Product | Product[] | object | number;

@controller('/Products', secure)
export class ProductController extends BaseController<controllerResponse> {
  @httpPost('/', validate(isProduct))
  async createProduct(@request() req: Request, @response() res: Response, @requestBody() body: ProductDTO) {
    try {
      const product = await products.createProduct(body, req);
      this.handleSuccess(req, res, product);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet('/', validate(isQuery))
  async getProducts(@request() req: Request, @response() res: Response, @queryParam() query: QueryDTO) {
    try {
      const prods = await products.getProducts(query);
      this.handleSuccess(req, res, prods);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet('/:id', validate(isID))
  async getProduct(@request() req: Request, @response() res: Response, @requestParam('id') id: string) {
    try {
      const Product = await products.getProductById(id);
      this.handleSuccess(req, res, Product);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpDelete('/:id', validate(isID))
  async deleteProduct(@request() req: Request, @response() res: Response, @requestParam('id') id: string) {
    try {
      const resp = await products.deleteProduct(id, req);
      this.handleSuccess(req, res, resp);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpPatch('/:id', validate(isID))
  async updateProduct(
    @request() req: Request,
    @response() res: Response,
    @requestParam('id') id: string,
    @requestBody() body: ProductDTO,
  ) {
    try {
      const product = await products.updateProduct(id, body);
      this.handleSuccess(req, res, product);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
