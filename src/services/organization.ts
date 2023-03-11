import { OrganizationDTO, QueryDTO } from '@app/data/models';
import { orgRepo } from '@app/data/repositories/organization.repo';
import { Request } from 'express';

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
    return await orgRepo.deleteRow(id, req['user'].organizationId);
  }

  async updateOrganization(id: string, org: OrganizationDTO) {
    return await orgRepo.upsert(id, org);
  }
}

export const Organizations = new OrganizationService();
