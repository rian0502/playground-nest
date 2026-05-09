import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { CacheKeys } from 'src/common/constants/cache-keys';
@Injectable()
export class UsersService {

    constructor(
        private readonly prisma: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    async findAll() {
        return this.prisma.user.findMany();
    }

    async findOne(id: string) {
        const cacheKey = CacheKeys.users.item(id);
        const cached = await this.cacheManager.get(cacheKey);

        if (cached) {
            return cached;
        }

        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        await this.cacheManager.set(cacheKey, user, 1000 * 60 * 60);
        return user;
    }

    async create(createUserDto: CreateUserDto) {
        const user = await this.prisma.user.create({
            data: createUserDto,
        });
        await this.cacheManager.del(CacheKeys.users.list);
        return user;
    }
}
