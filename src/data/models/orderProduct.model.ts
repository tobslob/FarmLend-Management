import { Column, DataType, ForeignKey, Index, Table } from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { Order } from './order.model';
import { Organization } from './organization.model';
import { Product } from './product.model';

@Table({ tableName: 'order_product' })
export class OrderProduct extends BaseModel {
  @Index
  @ForeignKey(() => Order)
  @Column({ type: DataType.UUID, allowNull: false, validate: { notEmpty: true } })
  orderId: string;

  @Index
  @ForeignKey(() => Product)
  @Column({ type: DataType.UUID, allowNull: false, validate: { notEmpty: true } })
  productId: string;

  @Index
  @ForeignKey(() => Organization)
  @Column({ type: DataType.UUID, allowNull: false, validate: { notEmpty: true } })
  organizationId: number;

  @Column({ type: DataType.INTEGER, allowNull: false, validate: { notEmpty: true } })
  volume: number;

  @Column({ type: DataType.INTEGER, allowNull: false, validate: { notEmpty: true } })
  pricePerUnit: number;
}
