import { OrganizationDTO, QueryDTO } from "@app/data/models";
import { orgRepo } from "@app/data/repositories/organization.repo";

class OrganizationService {
  async createOrganization(org: OrganizationDTO, t?: any) {
    try {
      return (await orgRepo.create({ ...org }, t))?.toJSON();
    } catch (error) {
      throw new Error(error?.original);
    }
  }

  async getOrganizationById(id: string) {
    try {
      return (await orgRepo.findById(id))?.toJSON();
    } catch (error) {
      throw new Error(error?.original);
    }
  }

  async getOrganizations(query: QueryDTO,) {
    try {
      return (await orgRepo.all(query));
    } catch (error) {
      throw new Error(error?.original);
    }
  }

  async deleteOrganization(id: string) {
    try {
      return await orgRepo.deleteRow(id);
    } catch (error) {
      throw new Error(error?.original);
    }
  }

  async updateOrganization(id: string, org: OrganizationDTO) {
    try {
      return await orgRepo.updateRows(id, org);
    } catch (error) {
      throw new Error(error?.original);
    }
  }
}

export const Organizations = new OrganizationService();
