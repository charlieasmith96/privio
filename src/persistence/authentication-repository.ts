import { Service } from 'typedi';
import { AUTHENTICATION_REPOSITORY } from '../config/services';
import { TokenEntity } from '../domain/token-model';
import { DbFactory } from './db-factory';
import { Token } from '../domain/user-authentication';

@Service(AUTHENTICATION_REPOSITORY)
export class AuthenticationRepository {

    async insertOne(tokenEntity: TokenEntity) : Promise<TokenEntity> {
        console.log('im inserting something')
        console.log(DbFactory.getDb())
        return await DbFactory.getDb().Token.create(tokenEntity);
    }

    async retrieveByToken(token: Token) : Promise<TokenEntity | null> {
        return DbFactory.getDb().Token.findOne({ where: {token} });
    }

    async deleteTokenByEmailAddress(emailAddress: string) {
        return DbFactory.getDb().Token.destroy({where: {emailAddress}})
    }
}