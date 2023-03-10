import { OrganizationDTO, Organization, QueryDTO } from "@app/data/models";
import { BaseController, validate } from "@app/data/util";
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
  response
} from "inversify-express-utils";
import { Request, Response } from "express";
import { isOrganization, isOrganizationUpdate } from "./organization.validator";
import { Organizations } from "@app/services/organization";
import { isID } from "../user/user.validator";
import { secure } from "@app/common/services/jsonwebtoken";
import { isQuery } from "../order/order.validator";

type controllerResponse = Organization | Organization[] | object | number;

@controller("/organizations", secure)
export class OrganizationController extends BaseController<controllerResponse> {
  @httpPost("/", validate(isOrganization))
  async createOrganization(
    @request() req: Request,
    @response() res: Response,
    @requestBody() body: OrganizationDTO
  ) {
    try {
      const org = await Organizations.createOrganization(body);
      this.handleSuccess(req, res, org);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet("/", validate(isQuery))
  async getOrganizations(
    @request() req: Request,
    @response() res: Response,
    @queryParam() query: QueryDTO
  ) {
    try {
      const Orgs = await Organizations.getOrganizations(query);
      this.handleSuccess(req, res, Orgs);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpGet("/:id", validate(isID))
  async getOrganization(
    @request() req: Request,
    @response() res: Response,
    @requestParam("id") id: string
  ) {
    try {
      const Organization = await Organizations.getOrganizationById(id);
      this.handleSuccess(req, res, Organization);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  @httpDelete("/:id", validate(isID))
  async deleteOrganization(
    @request() req: Request,
    @response() res: Response,
    @requestParam("id") id: string
  ) {
    try {
      const resp = await Organizations.deleteOrganization(id);
      this.handleSuccess(req, res, resp);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }

  // @TODO: update validate([]) to take schema list
  @httpPatch("/:id", validate(isID), validate(isOrganizationUpdate))
  async updateOrganization(
    @request() req: Request,
    @response() res: Response,
    @requestParam("id") id: string,
    @requestBody() body: OrganizationDTO
  ) {
    try {
      const organization = await Organizations.updateOrganization(id, body);
      this.handleSuccess(req, res, organization);
    } catch (error) {
      this.handleError(req, res, error);
    }
  }
}
