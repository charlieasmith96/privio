import { JsonController, Post, Body, Patch, Param, OnUndefined, Get, QueryParam } from 'routing-controllers';
import { NewUser } from '../domain/new-beer';
import { UserService } from '../service/user-service';
import { Inject } from 'typedi';
import { BeerUpdate } from '../domain/beer-update';
import { USER_SERVICE } from '../config/services';

@JsonController('/beers')
export class UserController {

    constructor(
        @Inject(USER_SERVICE)
        private readonly userService: UserService
    ) { }

    @Post()
    async addNewBeer(@Body() newBeer: NewUser) {
        return this.userService.addNewUser(newBeer);
    }

    @Patch('/:beerId')
    @OnUndefined(200) // because this one doesn't return an object
    async updateBeer(@Param('beerId') beerId: string, @Body() beerUpdate: BeerUpdate) {
        return this.userService.updateBeer(beerUpdate, beerId);
    }

    @Get()
    async findAll(@QueryParam('strong') strong?: boolean) {
        if (strong) {
            return this.userService.findStrongBeers();
        }
        return this.userService.findAll();
    }

    @Get('/:beerId')
    findOneById(@Param('beerId') beerId: string) {
        return this.userService.findOneById(beerId);
    }

}