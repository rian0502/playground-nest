import { Controller, Get, Post, Param, Body, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
@Controller('users')
@UseInterceptors(CacheInterceptor)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @CacheKey('all_users_list')
    @CacheTTL(1000 * 60 * 60)
    findAll() {
        return this.usersService.findAll();
    }
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }
}
