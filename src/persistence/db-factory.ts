import Sequelize from 'sequelize';
import { DbInterface } from '../typings/DbInterface';
import { UserFactory } from '../domain/user-model';
import { TokenFactory } from '../domain/token-model';

export class DbFactory {

    private static db : DbInterface;

    public static createModels = (sequelizeConfig: any) => {
        const { database, username, password, host, dialect } = sequelizeConfig;
        const sequelize = new Sequelize(database, username, password, {
            host,
            dialect
          })

        const db: DbInterface = {
            sequelize,
            Sequelize,
            User: UserFactory(sequelize, Sequelize),
            Token: TokenFactory(sequelize, Sequelize)
        };

        DbFactory.db = db;
        console.log('Created the following models: ')
        console.log(sequelize.models)
        console.log(db)
    }

    public static getDb() {
        return DbFactory.db;
    }
}

