import { Passwords } from '@app/services/password';
import { BeforeCreate, Column, DataType, ForeignKey, Index, Table } from 'sequelize-typescript';
import { BaseModel } from './base.model';
import { Organization, OrganizationType } from './organization.model';

@Table({ tableName: 'user' })
export class User extends BaseModel {
  @Column({ type: DataType.STRING, allowNull: false, validate: { notEmpty: true } })
  firstName: string;

  @Column({ type: DataType.STRING, allowNull: false, validate: { notEmpty: true } })
  lastName: string;

  @Index
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: { notEmpty: true, isEmail: true },
  })
  emailAddress: string;

  @Index
  @ForeignKey(() => Organization)
  @Column({ type: DataType.STRING, allowNull: true, validate: { notEmpty: true } })
  organizationId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: { notEmpty: true, isAlphanumeric: true },
  })
  password: string;

  @BeforeCreate
  static async hashPassword(user: User) {
    user.password = await Passwords.generateHash(user.password);
  }
}

export interface UserDTO {
  firstName: string;
  lastName: string;
  emailAddress: string;
  organizationId?: string;
  password: string;
  organizationName?: string;
  organizationType?: OrganizationType;
}

export interface LoginDTO {
  emailAddress: string;
  password: string;
}

export interface Auth extends User {
  token: string;
}
