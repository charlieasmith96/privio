import Sequelize from 'sequelize'
import { SequelizeAttributes } from '../typings';

export type TokenEntity = TokenAttributes;

// fields
export interface TokenAttributes {
    USER_ID: string;
    TOKEN: string;
    CREATE_DATE?: string;
    UPDATE_DATE?: string;
}

// row
export interface TokenInstance extends Sequelize.Instance<TokenAttributes>, TokenAttributes {}

// model creator
export const TokenFactory = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<TokenInstance, TokenAttributes> => {
    const attributes: SequelizeAttributes<TokenAttributes> = {
        USER_ID: {
            type: DataTypes.NUMERIC
        },
        TOKEN: {
            type: DataTypes.STRING
        }
    };
    const Token = sequelize.define<TokenInstance, TokenAttributes>('Token', attributes, {updatedAt: 'UPDATE_DATE', createdAt: 'CREATE_DATE'});

    return Token;
}
