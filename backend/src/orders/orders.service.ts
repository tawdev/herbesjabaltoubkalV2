import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
            bundle: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async findByUser(userId: number) {
    try {
      console.log('[DEBUG] OrdersService.findByUser searching for userId:', userId);
      return await this.prisma.order.findMany({
        where: { user_id: userId },
        include: {
          items: {
            include: {
              product: true,
              bundle: true,
            },
          },
        },
        orderBy: { created_at: 'desc' },
      });
    } catch (error) {
      console.error(`[ERROR] OrdersService.findByUser for ID ${userId}:`, error);
      return [];
    }
  }

  async findOne(id: number) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
            bundle: true,
          },
        },
      },
    });
  }

  async create(data: any, userId?: number) {
    console.log('[DEBUG] OrdersService.create received:', JSON.stringify(data, null, 2));
    const { items, ...orderData } = data;
    
    try {
      const result = await this.prisma.order.create({
        data: {
          ...orderData,
          user_id: userId,
          items: {
            create: items.map((item: any) => {
              const idStr = String(item.product_id);
              const isBundle = idStr.startsWith('bundle-');
              
              // Parse real ID (handle formats like "12-250g" or "bundle-5")
              const cleanIdPart = idStr.split('-')[isBundle ? 1 : 0];
              const realId = Number(cleanIdPart.replace('bundle', ''));
              
              return {
                product_id: isBundle ? null : realId,
                bundle_id: isBundle ? realId : null,
                quantity: item.quantity,
                price: item.price,
                weight: item.weight || null,
              };
            }),
          },
        },
        include: { items: true },
      });
      return result;
    } catch (error) {
      console.error('[ERROR] OrdersService.create failed:', error);
      throw error;
    }
  }

  async updateStatus(id: number, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  async getStats() {
    const totalOrders = await this.prisma.order.count();
    const totalRevenue = await this.prisma.order.aggregate({
      _sum: { total_price: true },
    });
    
    // Get sales by status
    const statusCounts = await this.prisma.order.groupBy({
      by: ['status'],
      _count: true,
    });

    // Get most sold products (simple version)
    const topItems = await this.prisma.orderItem.groupBy({
      by: ['product_id', 'bundle_id'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    return {
      totalOrders,
      totalRevenue: totalRevenue._sum.total_price || 0,
      statusCounts,
      topItems,
    };
  }
}
