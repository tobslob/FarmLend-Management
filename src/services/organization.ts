import { OrganizationDTO, QueryDTO } from "@app/data/models";
import { orgRepo } from "@app/data/repositories/organization.repo";

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
    return await orgRepo.deleteRow(id);
  }

  async updateOrganization(id: string, org: OrganizationDTO) {
    return await orgRepo.updateRows(id, org);
  }
}

export const Organizations = new OrganizationService();
