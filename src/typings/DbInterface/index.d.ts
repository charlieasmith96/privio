// src/typings/DbInterface/index.d.ts
import * as Sequelize from "sequelize";
import { UserInstance, UserAttributes } from "../../domain/user-model";
import { TokenInstance, TokenAttributes } from "../../domain/token-model";

export interface DbInterface {
  sequelize: Sequelize.Sequelize;
  Sequelize: Sequelize.SequelizeStatic;
  User: Sequelize.Model<UserInstance, UserAttributes>;
  Token: Sequelize.Model<TokenInstance, TokenAttributes>;
}