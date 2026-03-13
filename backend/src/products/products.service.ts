import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ProductCategory } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: { category?: ProductCategory; minPrice?: number; maxPrice?: number; search?: string }) {
    const { category, minPrice, maxPrice, search } = filters;
    
    return this.prisma.product.findMany({
      where: {
        ...(category && { category }),
        ...(minPrice !== undefined && { price: { gte: minPrice } }),
        ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
        ...(search && {
          OR: [
            { name: { contains: search } },
            { name_ar: { contains: search } },
            { description: { contains: search } },
          ],
        }),
      },
      include: {
        reviews: true,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        reviews: true,
      },
    });
  }

  async create(data: any) {
    return this.prisma.product.create({ data });
  }

  async update(id: number, data: any) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
