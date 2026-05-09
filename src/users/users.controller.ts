import { Controller, Get, Post, Param, Body, UseInterceptors, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { CacheKeys } from 'src/common/constants/cache-keys';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
@Controller('users')
@UseInterceptors(CacheInterceptor)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @CacheKey(CacheKeys.users.list)
    @CacheTTL(1000 * 60 * 60)
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    create(@Body() createUserDto: CreateUserDto) { 
        return this.usersService.create(createUserDto);
    }
}
