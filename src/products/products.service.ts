import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { CacheKeys } from 'src/common/constants/cache-keys';

// import { Product } from '@prisma/client';


@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) { }

  async create(createProductDto: CreateProductDto) {
    const product = this.prisma.product.create({
      data: createProductDto,
    });
    await this.cacheManager.del(CacheKeys.products.list);

    return product;
  }

  async findAll() {
    return this.prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        createdAt: false,
        updatedAt: false,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const cacheKey = CacheKeys.products.item(id);

    const cached = await this.cacheManager.get(cacheKey);

    if (cached) {
      return cached;
    }

    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(
        'Product not found',
      );
    }

    await this.cacheManager.set(cacheKey, product, 1000 * 60 * 60);

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    await this.cacheManager.del(CacheKeys.products.list);
    await this.cacheManager.del(CacheKeys.products.item(id));
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  async remove(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.cacheManager.del(CacheKeys.products.list);
    await this.cacheManager.del(CacheKeys.products.item(id));
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
