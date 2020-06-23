import { JsonController, Post, Body, Patch, Param, OnUndefined, Get, QueryParam, BadRequestError, NotFoundError } from 'routing-controllers';
import { NewUser } from '../domain/new-user';
import { UserService } from '../service/user-service';
import { Inject } from 'typedi';
import { USER_SERVICE } from '../config/services';
import { userSchema } from './schemas/user-schema';

@JsonController('/user')
export class UserController {

    constructor(@Inject(USER_SERVICE) private readonly userService: UserService) { }

    @Post()
    async addNewUser(@Body() newUser: NewUser) {
        if (userSchema.validate(newUser).error) {
            throw new BadRequestError("Invalid Request")
        }
        try {
            return await this.userService.addNewUser(newUser)
        } catch(err) {
            throw new BadRequestError("User already exists")
        }
    }

    @Get('/:userId')
    async retrieveUserById(@Param('userId') userId: string) {
        try {
            return await this.userService.retrieveUserById(userId);
        } catch(err) {
            throw new NotFoundError("User could not be found")
        }
    }
}
