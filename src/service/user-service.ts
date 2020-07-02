import { Service, Inject } from 'typedi';
import { NewUser } from '../domain/new-user';
import { UserDto } from '../domain/user-dto';
import { UserRepository } from '../persistence/user-repository';
import { USER_SERVICE, USER_REPOSITORY } from '../config/services';
import { UserAlreadyExistsException } from './exceptions/UserAlreadyExistsException';
import { UserEntity } from '../domain/user-model';
import { UserDoesNotExistException } from './exceptions/UserDoesNotExistException';

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
            if (err.original.code === 'ER_DUP_ENTRY') throw UserAlreadyExistsException(err.original.code); 
            throw new Error(err.code)
        }
    }

    async retrieveUserByEmailAddress(emailAddress: string) : Promise<UserDto> {
        try {
            const retrievedUser = await this.userRepository.retrieveByEmailAddress(emailAddress);
            return this.convertNewUserEntityToNewUserDto(retrievedUser);
        } catch(err) {
            throw UserDoesNotExistException(err.original.code);
        }
    }

    async retrieveUserById(id: string) : Promise<UserDto> {
        try {
            const retrievedUser = await this.userRepository.retrieveById(id);
            return this.convertNewUserEntityToNewUserDto(retrievedUser);
        } catch(err) {
            throw UserAlreadyExistsException(err.original.code);
        }
    }


    convertNewUserToNewUserEntity(newUser: NewUser) : UserEntity {
        const { firstName, lastName, emailAddress, phoneNumber, password} = newUser;
        return { FIRST_NAME: firstName, LAST_NAME: lastName, EMAIL_ADDRESS: emailAddress,
             PHONE_NUMBER: phoneNumber, HASHED_PASSWORD: password};
    }

    convertNewUserEntityToNewUserDto(newUserEntity: UserEntity): UserDto {
        const { FIRST_NAME, LAST_NAME, EMAIL_ADDRESS, PHONE_NUMBER, HASHED_PASSWORD } = newUserEntity; // destruct user object
        return { firstName: FIRST_NAME,
            lastName: LAST_NAME,
            emailAddress: EMAIL_ADDRESS,
            phoneNumber: PHONE_NUMBER,
            hashedPassword: HASHED_PASSWORD }; // construct dto
    }
}
