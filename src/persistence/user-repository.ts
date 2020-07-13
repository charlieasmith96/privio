import { DbFactory } from './db-factory';
import { Service } from 'typedi';
import {USER_REPOSITORY} from '../config/services';
import { UserEntity } from '../domain/user-model';

@Service(USER_REPOSITORY)
export class UserRepository {

    async insertOne(userEntity: UserEntity): Promise<UserEntity> {
        return DbFactory.getDb().User.create(userEntity)
    }
    
    async retrieveById(id: number) : Promise<UserEntity | null> {
        return DbFactory.getDb().User.findByPk(id);
    }

    async retrieveByEmailAddress(emailAddress: string) : Promise<UserEntity | null> {
        return DbFactory.getDb().User
        .findOne({ where: {EMAIL_ADDRESS: emailAddress} });
    }
}