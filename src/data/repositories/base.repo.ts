import { Model } from 'sequelize-typescript';
import { Transaction } from 'sequelize/types';

export interface IBaseRepository {
  all(attributes?: any): Promise<any | any[]>;
  findByEmail(attributes?: any): Promise<any>;
  findById(id: string, attributes?: any): Promise<any>;
  create(data: any, transaction?: any): Promise<any>;
  upsert(id: string, data: any, attributes: any): Promise<any>;
  deleteRow(query: any): Promise<number>;
  truncate(attributes: any): Promise<any>;
}

// @TODO: Remove //@ts-ignore, make Model compile with types
export abstract class BaseRepository<T extends Model> implements IBaseRepository {
  constructor(protected model: typeof Model) {}

  async all(attributes?: any): Promise<T | T[]> {
    // @ts-ignore
    return this.model.findAll(attributes);
  }

  async findById(id: string, attributes?: any) {
    // @ts-ignore
    return await this.model.findByPk(id, attributes);
  }

  async create(data: any, t?: any): Promise<T> {
    // @ts-ignore
    return this.model.create(data, { transaction: t });
  }

  async upsert(id: string, data: any, attributes?: any): Promise<T> {
    // @ts-ignore
    const resource = await this.model.findByPk(id);

    if (resource) {
      // @ts-ignore
      return await resource.update(data, { attributes });
    }
  }

  async update(id: string, data: any, attributes?: any): Promise<T> {
    // @ts-ignore
    const resource = await this.model.findOne({ where: { orderId: id } });

    if (resource) {
      // @ts-ignore
      return await resource.update(data, { attributes });
    }
  }

  async deleteRow(query: any, t?: Transaction): Promise<number> {
    return await this.model.destroy({ where: query, transaction: t });
  }

  async deleteByID(id: string, t?: Transaction): Promise<number> {
    return await this.model.destroy({ where: { id }, transaction: t });
  }

  async findByEmail(emailAddress: string) {
    // @ts-ignore
    return await this.model.findOne({ where: { emailAddress } });
  }

  async truncate(attributes?: any) {
    return await this.model.destroy({
      where: { ...attributes },
      force: true,
    });
  }
}
