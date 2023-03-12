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

let  DATABASE_URL = process.env.NODE_ENV === "production" ? process.env.DATABASE_URL_PRODUCTION : process.env.DATABASE_URL_DEV

const sequelize = new Sequelize(DATABASE_URL);

// Register our models with sequelize
sequelize.addModels([User, Product, Order, Organization, OrderProduct]);
sequelize.sync();

const db = { sequelize };

export default db;
