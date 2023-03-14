import db from '@app/data/database/connect';
import { OrganizationDTO, QueryDTO } from '@app/data/models';
import { orderRepo } from '@app/data/repositories/order.repo';
import { orderProductRepo } from '@app/data/repositories/orderProduct.repo';
// import { orderProductRepo } from '@app/data/repositories/orderProduct.repo';
import { orgRepo } from '@app/data/repositories/organization.repo';
import { productRepo } from '@app/data/repositories/product.repo';
import { userRepo } from '@app/data/repositories/user.repo';
import { Request } from 'express';
// import { productRepo } from '@app/data/repositories/product.repo';
// import { userRepo } from '@app/data/repositories/user.repo';

class OrganizationService {
  async createOrganization(org: OrganizationDTO, t?: any) {
    return (await orgRepo.create({ ...org }, t))?.toJSON();
  }

  async getOrganizationById(id: string) {
    return (await orgRepo.findById(id))?.toJSON();
  }

  async getOrganizations(query: QueryDTO) {
    return await orgRepo.all({ where: { ...query } });
  }

  async deleteOrganization(id: string, req: Request) {
    const orders: any = await orderRepo.all({ where: { organizationId: id } });

    if (id === req['user']?.organizationId) {
      throw new Error("you can't delete your own organization");
    }

    if (orders?.length != 0) {
      throw new Error("you can't delete an organization with orders");
    }

    // @TODO: Implement flag to force delete to pass the condition above
    // even if organization has orders
    db.sequelize.transaction(async (t) => {
      await orderProductRepo.deleteRow({ organizationId: id }, t);
      await productRepo.deleteRow({ organizationId: id }, t);
      await orderRepo.deleteRow({ organizationId: id }, t);
      await userRepo.deleteRow({ organizationId: id }, t);
      return await orgRepo.deleteByID(id);
    });
  }

  async updateOrganization(id: string, org: OrganizationDTO) {
    return await orgRepo.upsert(id, org);
  }
}

export const Organizations = new OrganizationService();
