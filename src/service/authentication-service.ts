import { Service, Inject } from 'typedi';
import { AUTHENTICATION_SERVICE, USER_REPOSITORY } from '../config/services';
import bcrypt from 'bcrypt';
import { AuthenticationRepository } from '../persistence/authentication-repository';

@Service(AUTHENTICATION_SERVICE)
export class AuthenticationService {

    constructor(@Inject(USER_REPOSITORY) private readonly authenticationRepository: AuthenticationRepository) { }

    private SALT_ROUNDS = 12

    public async checkPasswordWithHash(plaintextPassword: string, hashedPassword: string) : Promise<boolean>  {
        return await bcrypt.compare(plaintextPassword, hashedPassword);
    }

    async hashPassword(plaintextPassword : string) : Promise<string> {
        return await bcrypt.hash(plaintextPassword, this.SALT_ROUNDS);
    }

    authenticateUser(user : any) {
        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateAndSaveRefreshToken(user)


        // return token to FE
        // save refresh token in the database
    }

    generateAccessToken(user : any) {
        // @ts-ignore
        return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s'})
    }

    generateAndSaveRefreshToken(user : any) {
        // @ts-ignore
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);


    }

}