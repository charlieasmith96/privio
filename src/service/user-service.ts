import { Service, Inject } from 'typedi';
import { NewUser } from '../domain/new-user';
import { UserDto } from '../domain/user-dto';
import { UserRepository } from '../persistence/user-repository';
import { USER_SERVICE, USER_REPOSITORY } from '../config/services';
import { UserAlreadyExistsException } from './exceptions/UserAlreadyExistsException';
import { UserEntity } from '../domain/user-model';

@Service(USER_SERVICE)
export class UserService {

    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: UserRepository) { }

    async addNewUser(newUser: NewUser) : Promise<UserDto> {
        const newUserEntity = this.convertNewUserToNewUserEntity(newUser);
        try {
            const createdUser = await this.userRepository.insertOne(newUserEntity)
            console.log(`Successfully inserted user ${JSON.stringify(createdUser)}`)
            return this.convertNewUserEntityToNewUserDto(createdUser)
        } catch(err) {
            if (err.original.code === 'ER_DUP_ENTRY') throw UserAlreadyExistsException(err.original.code); 
            throw new Error(err.code)
        }
    }

    convertNewUserToNewUserEntity(newUser: NewUser) : UserEntity {
        const { firstName, lastName, emailAddress, phoneNumber} = newUser;
        return { FIRST_NAME: firstName, LAST_NAME: lastName, EMAIL_ADDRESS: emailAddress,
             PHONE_NUMBER: phoneNumber};
    }

    convertNewUserEntityToNewUserDto(newUserEntity: UserEntity): UserDto {
        const { FIRST_NAME, LAST_NAME, EMAIL_ADDRESS, PHONE_NUMBER } = newUserEntity; // destruct user object
        return { firstName: FIRST_NAME, lastName: LAST_NAME, emailAddress: EMAIL_ADDRESS, phoneNumber: PHONE_NUMBER}; // construct dto
    }
}
