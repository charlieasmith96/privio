import { JsonController, Post, Body, Patch, Param, OnUndefined, Get, QueryParam, BadRequestError, NotFoundError, InternalServerError } from 'routing-controllers';
import { NewUser } from '../domain/new-user';
import { Inject } from 'typedi';
import { USER_FACADE } from '../config/services';
import { userSchema } from './schemas/user-schema';
import { UserDto } from '../domain/user-dto';
import { UserFacade } from './user-facade';
import { UserAuthentication } from '../domain/user-authentication';

@JsonController('/user')
export class UserController {

    constructor(@Inject(USER_FACADE) private readonly userFacade: UserFacade) { }

    @Post()
    async addNewUser(@Body() newUser: NewUser) : Promise<UserDto> {
        if (userSchema.validate(newUser).error) {
            throw new BadRequestError('Invalid request')
        }
        try {
            console.log('im here!')
            return await this.userFacade.addNewUser(newUser)
        } catch(err) {
            if (err.message === 'ER_DUP_ENTRY') throw new BadRequestError('User already exists')
            throw new InternalServerError('Something went wrong')
        }
    }

    @Get('/:userId')
    async retrieveUserById(@Param('userId') userId: number) : Promise<UserDto>{
        try {
            return await this.userFacade.retrieveUserById(userId);
        } catch(err) {
            throw new NotFoundError('User could not be found')
        }
    }

    @Post('/login')
    async login(@Body() authenticationBody: UserAuthentication) {

        try {
            return await this.userFacade.authenticateUser(authenticationBody);
        }
        
        // hash password and check against salted password in DB
        // generate tokens in authentication service
        // return tokens to user
    }

    @Post('/logout')
    async logout() {
        // delete refresh token for given user
        // redirect on front end (somehow?!)
    }

    @Post('/token')
    async requestNewToken() {
        // check if refresh token is valid in the db
        // generate new access token if so
        // logout if not
    }
}
