import type { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PrismaService } from 'src/prisma/prisma.service';
import { CacheKeys } from 'src/common/constants/cache-keys';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Inject, Injectable, BadRequestException, NotFoundException } from '@nestjs/common';

@Injectable()
export class TransactionsService {

  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  async create(createTransactionDto: CreateTransactionDto, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      let totalTransaction = 0;
      const detailsData = [];

      for (const item of createTransactionDto.items) {

        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new NotFoundException(`Product with ID ${item.productId} not found`);
        }

        if (product.stock < item.qty) {
          throw new BadRequestException(`Available: ${product.stock}, Requested: ${item.qty}`);
        }

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.qty } },
        });

        totalTransaction += product.price * item.qty;
        detailsData.push({
          productId: item.productId,
          qty: item.qty,
          price: product.price,
        });
      }

      const transaction = await tx.transactionHeader.create({
        data: {
          userId,
          total: totalTransaction,
          details: {
            create: detailsData,
          },
        },
        include: {
          details: true,
        },
      });

      await this.cacheManager.del(CacheKeys.products.list);

      for (const item of createTransactionDto.items) {
        await this.cacheManager.del(CacheKeys.products.item(item.productId));
      }

      return {
        message: 'Transaksi berhasil dibuat',
        data: transaction,
      };
    });
  }

  async findAll() {
    return this.prisma.transactionHeader.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        details: { include: { product: { select: { name: true } } } },
      },
      orderBy: { transactionDate: 'desc' },
    });
  }


  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
