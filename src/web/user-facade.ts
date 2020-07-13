import { Service, Inject } from 'typedi';
import { USER_FACADE, USER_SERVICE, AUTHENTICATION_SERVICE } from '../config/services';
import { NewUser } from '../domain/new-user';
import { UserDto } from '../domain/user-dto';
import { UserService } from '../service/user-service';
import { AuthenticationService } from '../service/authentication-service';
import { UserAuthentication } from '../domain/user-authentication';

@Service(USER_FACADE)
export class UserFacade {

    constructor(@Inject(USER_SERVICE) private readonly userService: UserService,
                @Inject(AUTHENTICATION_SERVICE) private readonly authenticationService: AuthenticationService) { }

    async addNewUser(newUser: NewUser) : Promise<UserDto> {
        const hashedPassword = await this.authenticationService.hashPassword(newUser.password);
        newUser.password = hashedPassword;
        return this.userService.addNewUser(newUser);
    }

    async retrieveUserById(id: number) : Promise<UserDto> {
        return this.userService.retrieveUserById(id);
    }

    async retrieveUserByEmailAddress(emailAddress: string) : Promise<UserDto> {
        return this.userService.retrieveUserByEmailAddress(emailAddress);
    }

    async authenticateUser(userAuthentication: UserAuthentication) {
        const { hashedPassword } = await this.userService
        .retrieveUserByEmailAddress(userAuthentication.emailAddress);

        const isPasswordCorrect = this.authenticationService
        .checkPasswordWithHash(userAuthentication.password, hashedPassword);

        if (isPasswordCorrect) {
            this.authenticationService.generateAccessToken(userAuthentication)
        } else {

        }
    }
}