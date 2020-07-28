import { Service, Inject } from 'typedi';
import { AUTHENTICATION_SERVICE, USER_REPOSITORY } from '../config/services';
import bcrypt from 'bcrypt';
import { AuthenticationRepository } from '../persistence/authentication-repository';
import { Token } from '../domain/user-authentication';
import { UnauthorizedError } from 'routing-controllers/http-error/UnauthorizedError';
import jwt from 'jsonwebtoken';

export interface Tokens {
    refreshToken: Token;
    accessToken: Token;
}

@Service(AUTHENTICATION_SERVICE)
export class AuthenticationService {

    constructor(@Inject(USER_REPOSITORY) private readonly authenticationRepository: AuthenticationRepository) { }

    private SALT_ROUNDS = 12

    async checkPasswordWithHash(plaintextPassword: string, hashedPassword: string) : Promise<boolean>  {
        return await bcrypt.compare(plaintextPassword, hashedPassword);
    }

    async hashPassword(plaintextPassword : string) : Promise<string> {
        return await bcrypt.hash(plaintextPassword, this.SALT_ROUNDS);
    }

    async generateAndSaveTokens(emailAddress : string) : Promise<Tokens> {
        const accessToken = this.generateAccessToken(emailAddress);
        const refreshToken = await this.generateAndSaveRefreshToken(emailAddress)
        console.log(refreshToken)
        
        return { accessToken, refreshToken }
    }

    async deleteRefreshToken(emailAddress: string) {
        try {
            await this.authenticationRepository.deleteTokenByEmailAddress(emailAddress);
        } catch {

        }
    }

    async refreshToken(token: Token, emailAddress : string) : Promise<Token> {
        // if refresh token exists in db, return new access token
        const refreshToken = await this.authenticationRepository.retrieveByToken(token);

        if (refreshToken) {
            return this.generateAccessToken(emailAddress);
        } else {
            throw new UnauthorizedError;
        }
    }

    private generateAccessToken(emailAddress : string) : Token {
        // @ts-ignore
        return jwt.sign({uid: emailAddress}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s'})
    }

    private async generateAndSaveRefreshToken(emailAddress : string) : Promise<Token> {
        // @ts-ignore
        const refreshToken = jwt.sign({uid: emailAddress}, process.env.REFRESH_TOKEN_SECRET);
        console.log('refresh token: ' + refreshToken);
        return (await this.authenticationRepository.insertOne(refreshToken)).TOKEN;
    }
}