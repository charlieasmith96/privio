import Sequelize from 'sequelize'
import { SequelizeAttributes } from '../typings';

export type UserEntity = UserAttributes;
// fields
export interface UserAttributes {
    FIRST_NAME: string;
    LAST_NAME: string;
    EMAIL_ADDRESS: string;
    PHONE_NUMBER: string;
    CREATE_DATE?: string;
    UPDATE_DATE?: string;
}

// row
export interface UserInstance extends Sequelize.Instance<UserAttributes>, UserAttributes {}

// model creator
export const UserFactory = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): Sequelize.Model<UserInstance, UserAttributes> => {
    const attributes: SequelizeAttributes<UserAttributes> = {
        FIRST_NAME: {
            type: DataTypes.STRING
        },
        LAST_NAME: { 
            type: DataTypes.STRING
        },
        EMAIL_ADDRESS: { 
            type: DataTypes.STRING
        }, 
        PHONE_NUMBER: { 
            type: DataTypes.STRING
        }
    };

    const User = sequelize.define<UserInstance, UserAttributes>('User', attributes, {updatedAt: 'UPDATE_DATE', createdAt: 'CREATE_DATE'});

    return User
}