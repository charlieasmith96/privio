import Sequelize from "sequelize";
import { DbInterface } from "../typings/DbInterface";
import { UserFactory } from "../domain/user-model";

export class DbFactory {

    private static db : DbInterface;
     
    public static createModels = (sequelizeConfig: any) => {
        const { database, username, password, host, dialect } = sequelizeConfig;
        const sequelize = new Sequelize(database, username, password, {
            host: host,
            dialect: dialect
          })
    
        const db: DbInterface = {
            sequelize,
            Sequelize,
            User: UserFactory(sequelize, Sequelize)
        };
        
        DbFactory.db = db;
    }

    public static getDb() {
        return DbFactory.db;
    }
}

