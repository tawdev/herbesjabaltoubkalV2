import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
// ProductCategory import removed as it is now a model

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(filters: {
    categorySlug?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
  }) {
    const { categorySlug, minPrice, maxPrice, search } = filters;

    return this.prisma.product.findMany({
      where: {
        ...(categorySlug && { category: { slug: categorySlug } }),
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
        category: true,
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
    const { category, ...rest } = data;
    let category_id = data.category_id;

    if (category && typeof category === 'string') {
      const cat = await this.prisma.category.findUnique({ where: { slug: category } });
      if (cat) {
        category_id = cat.id;
      }
    }

    return this.prisma.product.create({ 
      data: { 
        ...rest, 
        ...(category_id && { category: { connect: { id: category_id } } }) 
      } 
    });
  }

  async update(id: number, data: any) {
    const { category, ...rest } = data;
    let category_id = data.category_id;

    if (category && typeof category === 'string') {
      const cat = await this.prisma.category.findUnique({ where: { slug: category } });
      if (cat) {
        category_id = cat.id;
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        ...(category_id && { category: { connect: { id: category_id } } })
      },
    });
  }

  async remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}
