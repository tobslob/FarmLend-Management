import { BelongsToMany, DataType, Column, ForeignKey, Index, Table } from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { Order } from './order.model';
import { OrderProduct } from './orderProduct.model';
import { Organization } from './organization.model';

@Table({ tableName: 'Products' })
export class Product extends BaseModel {
  @BelongsToMany(() => Order, () => OrderProduct)
  orders: Order[];

  @Index
  @Column({ type: DataType.STRING, allowNull: false, validate: { notEmpty: true } })
  category: string;

  @Index
  @Column({ type: DataType.STRING, allowNull: false, validate: { notEmpty: true } })
  variety: string;

  @Column({ type: DataType.STRING, allowNull: false, validate: { notEmpty: true } })
  packaging: string;

  @ForeignKey(() => Organization)
  @Column({ type: DataType.UUID, allowNull: false, validate: { notEmpty: true } })
  organizationId: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  volume: string;

  @Column({ type: DataType.INTEGER, allowNull: true })
  pricePerUnit: string;
}

export interface ProductDTO {
  category: string;
  variety: string;
  packaging: string;
  volume: number;
  pricePerUnit: number;
}
