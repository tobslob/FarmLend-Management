import { BelongsToMany, Column, ForeignKey, Index, Table } from "sequelize-typescript";
import { BaseModel } from "./base.model";
import { Order } from "./order.model";
import { OrderProduct } from "./orderProduct.model";
import { Organization } from "./organization.model";

@Table({ tableName: "product" })
export class Product extends BaseModel {
  @BelongsToMany(() => Order, () => OrderProduct)
  orders: Order[];

  @Index
  @Column({ allowNull: false, validate: { notEmpty: true } })
  category: string;

  @Index
  @Column({ allowNull: false, validate: { notEmpty: true } })
  variety: string;

  @Column({ allowNull: false, validate: { notEmpty: true } })
  packaging: string;

  @ForeignKey(() => Organization)
  organizationId: string;

  @Column({ allowNull: true })
  volume: string;

  @Column({ allowNull: true })
  pricePerUnit: string;
}

export interface ProductDTO {
  category: string;
  variety: string;
  packaging: string;
}
