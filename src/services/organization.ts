import { OrganizationDTO, QueryDTO } from '@app/data/models';
import { orderRepo } from '@app/data/repositories/order.repo';
import { orgRepo } from '@app/data/repositories/organization.repo';

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

  async deleteOrganization(id: string) {
    const orders: any = await orderRepo.all({ where: { organizationId: id }})
    if (orders?.length != 0) {
      throw new Error("you can't delete an organization with orders")
    }
    return await orgRepo.deleteByID(id);
  }

  async updateOrganization(id: string, org: OrganizationDTO) {
    return await orgRepo.upsert(id, org);
  }
}

export const Organizations = new OrganizationService();
