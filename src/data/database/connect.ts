import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import { Order, Organization, Product, User } from '../models';
import dotenv from 'dotenv';
import { OrderProduct } from '../models/orderProduct.model';

dotenv.config();

export const sequelizeOptions: SequelizeOptions = {
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.PORT),
  logQueryParameters: true,
  models: [`${__dirname}/data/models`],
  repositoryMode: true,
};

const sequelize = new Sequelize(process.env.DATABASE_URL);

// Register our models with sequelize
sequelize.addModels([User, Product, Order, Organization, OrderProduct]);
sequelize.sync();

const db = { sequelize };

export default db;
