import { BelongsToMany, Column, ForeignKey, Index, Table } from "sequelize-typescript";
import { BaseModel } from "./base.model";
import { OrderProduct } from "./orderProduct.model";
import { Organization } from "./organization.model";
import { Product } from "./product.model";

@Table({ tableName: "order" })
export class Order extends BaseModel {
  @BelongsToMany(() => Product, () => OrderProduct)
  products: Product[];

  @Index
  @Column({ allowNull: false, validate: { notEmpty: true } })
  type: OrderType;

  @Column({ allowNull: true })
  references: string;

  @Index
  @ForeignKey(() => Organization)
  @Column({ allowNull: false, validate: { notEmpty: true } })
  organizationId: string;
}

export enum OrderType {
  BUY = "buy",
  SELL = "sell"
}

export interface OrderDTO {
  type: OrderType;
  references: string;
  products: Product[];
}

export interface QueryDTO {
  type?: OrderType;
  organizationId?: string;
  name?: string;
  category?: string;
  variety?: string;
}
