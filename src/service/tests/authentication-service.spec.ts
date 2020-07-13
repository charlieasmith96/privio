import bcrypt from 'bcrypt';
import sinon from 'sinon';
import { AuthenticationService } from '../authentication-service';
import { expect } from 'chai';
import { AuthenticationRepository } from '../../persistence/authentication-repository';
jest.mock('../../persistence/authentication-repository');

describe('My test suite', () => {

    let authenticationService: AuthenticationService;
    let authenticationRepoMock: AuthenticationRepository;

    beforeEach(() => {
        authenticationRepoMock = new AuthenticationRepository();
        authenticationService = new AuthenticationService(authenticationRepoMock)
    })

    it('should do something', async () => {
        const stub = sinon.stub(bcrypt, 'compare');
        stub.withArgs('dog', 'x1p3!ol_ope11').resolves(true)
        expect(await authenticationService.checkPasswordWithHash('dog', 'x1p3!ol_ope11')).to.eq(true);
    })

    afterEach(() => {
      sinon.restore();
    });
  });