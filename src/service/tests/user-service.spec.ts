import { UserService } from '../user-service';
import { UserRepository } from '../../persistence/user-repository';
import { NewUser } from '../../domain/new-user';
import { UserDto } from '../../domain/user-dto';
import { UserEntity } from '../../domain/user-model';
jest.mock('../../persistence/user-repository')

let userService: UserService;
let userRepositoryMock: UserRepository;

describe('addNewUser', () => {
    it('should return expected user dto given user', async () => {
        // given
        const userEntity: UserEntity = {
            FIRST_NAME: 'charlie',
            LAST_NAME: 'smith',
            EMAIL_ADDRESS: 'charlieasmith96',
            PHONE_NUMBER: '07709382913',
            HASHED_PASSWORD: '1!p',
        }

        const user : NewUser = {
            firstName: 'charlie',
            lastName: 'smith',
            emailAddress: 'charlieasmith96',
            password: 'dog',
            phoneNumber: '07709382913'
        };

        mockInsertOne(userEntity)

        userRepositoryMock = new UserRepository();
        userService = new UserService(userRepositoryMock)

        const expectedResult : UserDto = {
            firstName: 'charlie',
            lastName: 'smith',
            emailAddress: 'charlieasmith96',
            hashedPassword: '1!p',
            phoneNumber: '07709382913'
        };

       // when
        const result = await userService.addNewUser(user);

        // then
        expect(result).toEqual(expectedResult);
    }),

    it('should throw error with ER_DUP_ENTRY when error code is ER_DUP_ENTRY', async () => {
        // given
        const err = {
            message: 'This is an error',
            original: {
                code: 'ER_DUP_ENTRY'
            }
        }

        const user : NewUser = {
            firstName: 'charlie',
            lastName: 'smith',
            emailAddress: 'charlieasmith96',
            password: 'dog',
            phoneNumber: '07709382913'
        };

        mockInsertOneRejected(err)

        userRepositoryMock = new UserRepository();
        userService = new UserService(userRepositoryMock)

       // when, then
        try {
            await userService.addNewUser(user)
        } catch(e) {
            expect(e.message).toEqual('ER_DUP_ENTRY');
        }
    })
})

describe('retrieveUserByEmailAddress', () => {
    it('should get user by email address', async() => {
        // given
        const emailAddress = 'test-email-address@test.com';

        const userEntity: UserEntity = {
            FIRST_NAME: 'charlie',
            LAST_NAME: 'smith',
            EMAIL_ADDRESS: 'charlieasmith96',
            PHONE_NUMBER: '07709382913',
            HASHED_PASSWORD: '1!p',
        }

        const expectedResult : UserDto = {
            firstName: 'charlie',
            lastName: 'smith',
            emailAddress: 'charlieasmith96',
            hashedPassword: '1!p',
            phoneNumber: '07709382913'
        };

        // when
        mockRetrieveByEmailAddress(userEntity);

        userRepositoryMock = new UserRepository();
        userService = new UserService(userRepositoryMock)

        const result = await userService.retrieveUserByEmailAddress(emailAddress);

        // then
        expect(result).toEqual(expectedResult);
    }),
    it('should throw error if promise rejects and error code is ER_NO_USER_FOUND', async() => {
        // given
        const emailAddress = 'test-email-address@test.com';

        const err = {
            message: 'This is an error',
            original: {
                code: 'ER_NO_USER_FOUND'
            }
        }

        mockRetrieveByEmailAddressRejected(err);

        userRepositoryMock = new UserRepository();
        userService = new UserService(userRepositoryMock)

        // then, when
        try {
            await userService.retrieveUserByEmailAddress(emailAddress)
        } catch(e) {
            expect(e.message).toEqual('ER_NO_USER_FOUND');
        }
    })
})
describe('retrieveUserById', () => {
    it('should get user by id', async() => {
        // given
        const userId = 23;

        const userEntity: UserEntity = {
            FIRST_NAME: 'charlie',
            LAST_NAME: 'smith',
            EMAIL_ADDRESS: 'charlieasmith96',
            PHONE_NUMBER: '07709382913',
            HASHED_PASSWORD: '1!p',
        }

        const expectedResult : UserDto = {
            firstName: 'charlie',
            lastName: 'smith',
            emailAddress: 'charlieasmith96',
            hashedPassword: '1!p',
            phoneNumber: '07709382913'
        };

        mockRetrieveById(userEntity)

        userRepositoryMock = new UserRepository();
        userService = new UserService(userRepositoryMock)

        // when
        const result = await userService.retrieveUserById(userId);

        // then
        expect(result).toEqual(expectedResult)
    }),
    it('should return user not found if promise rejected with error code ER_NO_USER_FOUND', async() => {
        // given
        const userId = 23;

        const err = {
            message: 'This is an error',
            original: {
                code: 'ER_NO_USER_FOUND'
            }
        }

        mockRetrieveByIdRejected(err)

        userRepositoryMock = new UserRepository();
        userService = new UserService(userRepositoryMock)

        // then, when
        try {
            await userService.retrieveUserById(userId)
        } catch(e) {
            expect(e.message).toEqual('ER_NO_USER_FOUND');
        }
    })
})

const mockInsertOne = (returnValue : UserEntity) => {
    (UserRepository as jest.Mock).mockImplementation(function() {
        return {insertOne: jest.fn().mockResolvedValue(returnValue)}
    })
}

const mockInsertOneRejected = (returnValue : any) => {
    (UserRepository as jest.Mock).mockImplementation(function() {
        return {insertOne: jest.fn().mockRejectedValue(returnValue)}
    })
}

const mockRetrieveByEmailAddress = (returnValue: UserEntity) => {
    (UserRepository as jest.Mock).mockImplementation(function() {
        return {retrieveByEmailAddress: jest.fn().mockResolvedValue(returnValue)}
    })
}

const mockRetrieveByEmailAddressRejected = (returnValue: any) => {
    (UserRepository as jest.Mock).mockImplementation(function() {
        return {retrieveByEmailAddress: jest.fn().mockRejectedValue(returnValue)}
    })
}

const mockRetrieveById = (returnValue: UserEntity) => {
    (UserRepository as jest.Mock).mockImplementation(function() {
        return {retrieveById: jest.fn().mockResolvedValue(returnValue)}
    })
}

const mockRetrieveByIdRejected = (returnValue: any) => {
    (UserRepository as jest.Mock).mockImplementation(function() {
        return {retrieveById: jest.fn().mockRejectedValue(returnValue)}
    })
}