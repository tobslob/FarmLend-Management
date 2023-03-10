import { Column, HasMany, Index, Table } from "sequelize-typescript";
import { BaseModel } from "./base.model";
import { Order } from "./order.model";
import { Product } from "./product.model";

@Table({ tableName: "organization" })
export class Organization extends BaseModel {
  @Index
  @Column({ allowNull: false, unique: true, validate: { notEmpty: true } })
  name: string;

  @Index
  @Column({ allowNull: false, validate: { notEmpty: true } })
  type: OrganizationType;

  @HasMany(() => Product, "id")
  products: Product[];

  @HasMany(() => Order, "id")
  orders: Order[];
}

export enum OrganizationType {
  SELLER = "seller",
  BUYER = "buyer"
}

export interface OrganizationDTO {
  name?: string;
  type?: OrganizationType;
  products?: Product[];
  orders?: Order[];
}
