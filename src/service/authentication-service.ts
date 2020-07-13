import { Service, Inject } from 'typedi';
import { AUTHENTICATION_SERVICE, USER_REPOSITORY } from '../config/services';
import bcrypt from 'bcrypt';
import { AuthenticationRepository } from '../persistence/authentication-repository';
import { UserAuthentication, Token } from '../domain/user-authentication';

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

    authenticateUser(userAuthentication : UserAuthentication) {
        const accessToken = this.generateAccessToken(userAuthentication);
        const refreshToken = this.generateAndSaveRefreshToken(userAuthentication)
        // return token to FE
        // save refresh token in the database
    }

    generateAccessToken(userAuthentication : UserAuthentication) : Token {
        // @ts-ignore
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s'})
    }

    async generateAndSaveRefreshToken(user : UserAuthentication) : Promise<Token> {
        // @ts-ignore
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
        return (await this.authenticationRepository.insertOne(refreshToken)).TOKEN;
    }

    async refreshToken(token: Token) : Promise<Token> {
        // if refresh token exists in db, return new access toke
        const refreshToken = await this.authenticationRepository.retrieveByToken(token);

        if (refreshToken) {
            return this.generateAccessToken();
        }
    }

}