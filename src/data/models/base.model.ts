import { Column, CreatedAt, DataType, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';

@Table
export class BaseModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4 })
  id: string;

  @CreatedAt
  @Column({ allowNull: false })
  createdAt!: Date;

  @UpdatedAt
  @Column({ allowNull: false })
  updatedAt!: Date;
}
