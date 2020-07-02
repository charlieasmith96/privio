import 'reflect-metadata';
import * as http from 'http';
import { Container } from 'typedi';
import { createExpressServer, useContainer } from 'routing-controllers';
import { SERVER_PORT, sequelizeConfig } from './config/config';
import { UserRepository } from './persistence/user-repository';
import { UserService } from './service/user-service';
import { UserController } from './web/user-controller';
import { DbFactory } from './persistence/db-factory';
import { AuthenticationService } from './service/authentication-service';
import { UserFacade } from './web/user-facade';

useContainer(Container);

export class App {

    private httpServer!: http.Server;

    constructor() {
        Container.import([
            UserRepository,
            UserService,
            AuthenticationService,
            UserFacade
        ]);
    }

    async start(): Promise<http.Server> {
        DbFactory.createModels(sequelizeConfig);
        return this.startHttpServer();
    }

    private startHttpServer(): Promise<http.Server> {
        return new Promise((resolve) => {
            this.httpServer = createExpressServer({
                controllers: [
                    UserController,
                ],
            });
            this.httpServer.listen(SERVER_PORT, () => {
                console.log('server running on *:' + SERVER_PORT);
                resolve(this.httpServer);
            });
        });
    }
}