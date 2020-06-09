import 'reflect-metadata';
import * as http from 'http';
import { Container } from 'typedi';
import { createExpressServer, useContainer } from 'routing-controllers';
import { SERVER_PORT } from './config/config';
import { DbFactory } from './persistence/db-factory';
import { BeerRepository } from './persistence/beer-repository';
import { UserService } from './service/user-service';
import { UserController } from './web/user-controller';

useContainer(Container);

export class App {

    private httpServer!: http.Server;

    constructor() {
        Container.import([
            BeerRepository,
            UserService,
        ]);
    }

    async start(): Promise<http.Server> {
        await DbFactory.init();
        return this.startHttpServer();
    }

    private startHttpServer(): Promise<http.Server> {
        return new Promise((resolve, reject) => {
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