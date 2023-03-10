import { Column, ForeignKey, Index, Table } from "sequelize-typescript";
import { BaseModel } from "./base.model";
import { Order } from "./order.model";
import { Product } from "./product.model";

@Table({ tableName: "order_product" })
export class OrderProduct extends BaseModel {
  @Index
  @ForeignKey(() => Order)
  @Column({ allowNull: false, validate: { notEmpty: true } })
  orderId: string;

  @ForeignKey(() => Product)
  @Column({ allowNull: false, validate: { notEmpty: true } })
  productId: string;

  @Column({ allowNull: false, validate: { notEmpty: true } })
  volume: number;

  @Column({ allowNull: false, validate: { notEmpty: true } })
  pricePerUnit: number;
}