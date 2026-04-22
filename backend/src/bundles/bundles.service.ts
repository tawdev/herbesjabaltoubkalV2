import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BundlesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.bundle.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.bundle.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });
  }

  async create(data: any) {
    const { items, ...bundleData } = data;
    return this.prisma.bundle.create({
      data: {
        ...bundleData,
        items: {
          create: items.map((item: any) => ({
            product_id: Number(item.product_id),
            quantity: Number(item.quantity) || 1,
          })),
        },
      },
      include: { items: true },
    });
  }

  async update(id: number, data: any) {
    const { items, ...bundleData } = data;

    // Delete existing items first for simplicity during update
    await this.prisma.bundleItem.deleteMany({
      where: { bundle_id: id },
    });

    return this.prisma.bundle.update({
      where: { id },
      data: {
        ...bundleData,
        items: {
          create: items.map((item: any) => ({
            product_id: Number(item.product_id),
            quantity: Number(item.quantity) || 1,
          })),
        },
      },
      include: { items: true },
    });
  }

  async remove(id: number) {
    return this.prisma.bundle.delete({
      where: { id },
    });
  }
}
