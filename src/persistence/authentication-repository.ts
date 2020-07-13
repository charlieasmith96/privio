import { Service } from 'typedi';
import { AUTHENTICATION_REPOSITORY } from '../config/services';
import { TokenEntity } from '../domain/token-model';
import { DbFactory } from './db-factory';

@Service(AUTHENTICATION_REPOSITORY)
export class AuthenticationRepository {

    async insertOne(tokenEntity: TokenEntity) {
        return DbFactory.getDb().Token.create(tokenEntity);
    }

}