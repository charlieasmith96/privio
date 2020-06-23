import { DbFactory } from './db-factory';
import { Service } from 'typedi';
import {USER_REPOSITORY} from '../config/services';
import { UserEntity } from '../domain/user-model';

@Service(USER_REPOSITORY)
export class UserRepository {

    async insertOne(userEntity: UserEntity): Promise<any> {
        return DbFactory.getDb().User.create(userEntity)
    }
    
    async retrieveById(id: string) : Promise<any> {
        return DbFactory.getDb().User.findById(id);
    }
}