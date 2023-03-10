import { BelongsToMany, Column, DataType, ForeignKey, Index, Table } from "sequelize-typescript";
import { BaseModel } from "./base.model";
import { OrderProduct } from "./orderProduct.model";
import { Organization } from "./organization.model";
import { Product } from "./product.model";

@Table({ tableName: "order" })
export class Order extends BaseModel {
  @BelongsToMany(() => Product, () => OrderProduct)
  products: Product[];

  @Index
  @Column({
    type: DataType.ENUM,
    values: ["buy", "sell"],
    allowNull: false,
    validate: { notEmpty: true }
  })
  type: OrderType;

  @Column({ type: DataType.UUID, allowNull: true })
  references: string;

  @Index
  @ForeignKey(() => Organization)
  @Column({ type: DataType.UUID, allowNull: false, validate: { notEmpty: true } })
  organizationId: string;
}

export enum OrderType {
  BUY = "buy",
  SELL = "sell"
}

interface ProductDetails {
  productId: string;
  volume: number;
}

export interface OrderDTO {
  type: OrderType;
  references: string;
  products: ProductDetails[];
}

export interface QueryDTO {
  type?: OrderType;
  organizationId?: string;
  name?: string;
  category?: string;
  variety?: string;
}
