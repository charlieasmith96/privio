import { Server } from 'http';
import { App } from '../src/app';
import { DbFactory } from '../src/persistence/db-factory';
import { expect } from 'chai';
import supertest, { SuperTest, Test } from 'supertest';

const userA = { firstName: "charlie", lastName: "smith", password: 'testpassword', emailAddress: "test@gmail.com", phoneNumber: "01423873433" }
const userB = { firstName: "tom", lastName: "johns", password: 'testpassword', emailAddress: "test@gmail.com", phoneNumber: "01482849113" }
const invalidUser = { firstName: "tom", lastName: "johns", password: 'testpassword', emailAddress: "testgmail", phoneNumber: "01482849113" }

describe('/user tests', async () => {

    let request: SuperTest<Test>
    let app: App;
    let server: Server;

    before(async () => {
        app = new App();
        server = await app.start();
        request = supertest(server);
    });

    it('add user', (done) => {
        request
        .post('/user')
        .send(userA)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
            expect(res.body.firstName).to.eq('charlie')
            expect(res.body.lastName).to.eq('smith')
            expect(res.body.emailAddress).to.eq('test@gmail.com')
            expect(res.body.phoneNumber).to.eq('01423873433') 
            done()
        })
    }),
    it('should not add duplicate email address', (done) => {
         request
        .post('/user')
        .send(userA)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(() => {
            request
            .post('/user')
            .send(userB)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400, done);
        })
    }),
    it('should return a bad response if request is invalid', (done) => {
        request
       .post('/user')
       .send(invalidUser)
       .set('Accept', 'application/json')
       .expect('Content-Type', /json/)
       .expect(400, done);
   }),
   it('should retrieve a user', (done) => {
       request
       .post('/user')
       .send(userA)
       .set('Accept', 'application/json')
       .expect(200)
       .then(() => {
           return request
           .get('/user/1')
           .set('Accept', 'application/json')
           .expect(200)
       }).then((res) => {
        expect(res.body.firstName).to.eq('charlie')
        expect(res.body.lastName).to.eq('smith')
        expect(res.body.emailAddress).to.eq('test@gmail.com')
        expect(res.body.phoneNumber).to.eq('01423873433') 
        done()
    })
    }),
    it.only('should return 404 if user does not exist/not found', (done) => {
        request
        .get('/user/2')
        .set('Accept', 'application/json')
        .expect(404, done)
    })   

    afterEach(async () => {
        DbFactory.getDb().User.destroy({ truncate: true })
    });

});