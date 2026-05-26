import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { Keyv } from 'keyv';
import { KeyvCacheableMemory } from 'cacheable';
import { AuthModule } from './auth/auth.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        stores: [
          new Keyv({
            store: new KeyvCacheableMemory({
              ttl: configService.get<number>('CACHE_TTL') || 60000,
              lruSize: 5000
            }),
          }),
          new KeyvRedis(configService.get<string>('REDIS_URL')),
        ],
      }),
    }),
    PrismaModule,
    UsersModule,
    ProductsModule,
    AuthModule,
    TransactionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
