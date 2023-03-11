import { Column, DataType, HasMany, Index, Table } from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { Order } from './order.model';
import { Product } from './product.model';

@Table({ tableName: 'organization' })
export class Organization extends BaseModel {
  @Index
  @Column({ type: DataType.STRING, allowNull: false, unique: true, validate: { notEmpty: true } })
  name: string;

  @Index
  @Column({
    type: DataType.ENUM,
    values: ['buyer', 'seller'],
    allowNull: false,
    validate: { notEmpty: true },
  })
  type: OrganizationType;

  @HasMany(() => Product, 'organizationId')
  product: Product[];

  @HasMany(() => Order, 'organizationId')
  order: Order[];
}

export enum OrganizationType {
  SELLER = 'seller',
  BUYER = 'buyer',
}

export interface OrganizationDTO {
  name?: string;
  type?: OrganizationType;
  products?: Product[];
  orders?: Order[];
}
