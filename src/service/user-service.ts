import { Service, Inject } from 'typedi';
import { NewUser } from '../domain/new-user';
import { UserDto } from '../domain/user-dto';
import { UserRepository } from '../persistence/user-repository';
import { USER_SERVICE, USER_REPOSITORY } from '../config/services';
import { UserAlreadyExistsException } from './exceptions/UserAlreadyExistsException';
import { UserEntity } from '../domain/user-model';
import { UserDoesNotExistException } from './exceptions/UserDoesNotExistException';
import { ErrorCodes } from '../web/error-code-enums';

@Service(USER_SERVICE)
export class UserService {

    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepository) { }

    async addNewUser(newUser: NewUser) : Promise<UserDto> {
        const newUserEntity = this.convertNewUserToNewUserEntity(newUser);
        console.log(newUserEntity.HASHED_PASSWORD);
        try {
            const createdUser = await this.userRepository.insertOne(newUserEntity)
            console.log(`Successfully inserted user ${JSON.stringify(createdUser)}`)
            return this.convertNewUserEntityToNewUserDto(createdUser)
        } catch(err) {
            if (err.original.code === ErrorCodes.ER_DUP_ENTRY) throw UserAlreadyExistsException(err.original.code);
            throw new Error(err.code)
        }
    }

    async retrieveUserByEmailAddress(emailAddress: string) : Promise<UserDto> {
        try {
            const retrievedUser = await this.userRepository.retrieveByEmailAddress(emailAddress);
            return this.convertNewUserEntityToNewUserDto(retrievedUser);
        } catch(err) {
            if (err.original && err.original.code === ErrorCodes.ER_NO_USER_FOUND) throw UserDoesNotExistException(err.original.code);
            throw new Error(err.code)
        }
    }

    async retrieveUserById(id: number) : Promise<UserDto> {
        try {
            const retrievedUser = await this.userRepository.retrieveById(id);
            return this.convertNewUserEntityToNewUserDto(retrievedUser);
        } catch(err) {
            console.log(err)
            if (err.original  && err.original.code === ErrorCodes.ER_NO_USER_FOUND) throw UserDoesNotExistException(err.original.code);
            throw new Error(err.code)
        }
    }


    convertNewUserToNewUserEntity(newUser: NewUser | null) : UserEntity {
        if (!newUser) throw Error('Invalid argument for converter')

        const { firstName, lastName, emailAddress, phoneNumber, password} = newUser;
        return { FIRST_NAME: firstName, LAST_NAME: lastName, EMAIL_ADDRESS: emailAddress,
             PHONE_NUMBER: phoneNumber, HASHED_PASSWORD: password};
    }

    convertNewUserEntityToNewUserDto(newUserEntity: UserEntity | null): UserDto {
        if (!newUserEntity)  throw Error('Invalid argument for converter')

        const { FIRST_NAME, LAST_NAME, EMAIL_ADDRESS, PHONE_NUMBER, HASHED_PASSWORD } = newUserEntity; // destruct user object
        return { firstName: FIRST_NAME,
            lastName: LAST_NAME,
            emailAddress: EMAIL_ADDRESS,
            phoneNumber: PHONE_NUMBER,
            hashedPassword: HASHED_PASSWORD }; // construct dto
    }
}
