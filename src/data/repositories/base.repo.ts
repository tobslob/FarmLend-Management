import { Model } from "sequelize-typescript";

export interface IBaseRepository {
  all(attributes?: any): Promise<any | any[]>;
  findOne(attributes?: any): Promise<any>;
  findById(id: string, attributes?: any): Promise<any>;
  create(data: any, transaction?: any): Promise<any>;
  updateRows(id: string, data: any): Promise<any>;
  deleteRow(id: string): Promise<number>;
}

// @TODO: Remove //@ts-ignore, make Model compile with types
export abstract class BaseRepository<T extends Model> implements IBaseRepository {
  constructor(protected model: typeof Model) {}

  async all(attributes?: any): Promise<T | T[]> {
    // @ts-ignore
    return this.model.findAll({
      where: { ...attributes }
    });
  }

  async findById(id: string, attributes?: any) {
    // @ts-ignore
    return await this.model.findByPk(id, {
      attributes
    });
  }

  async create(data: any, t?: any): Promise<T> {
    // @ts-ignore
    return this.model.create(data, { transaction: t });
  }

  async updateRows(id: string, data: any): Promise<T> {
    const resource = await this.findById(id);

    if (resource) {
      // @ts-ignore
      return await resource.update(data);
    }
  }

  async deleteRow(id: string): Promise<number> {
    return await this.model.destroy({ where: { id } });
  }

  async findOne([T]: any) {
    // @ts-ignore
    return await this.model.findOne({ T });
  }
}
