import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        orders: {
          select: {
            total_price: true,
          }
        }
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async updateStatus(id: number, status: any) {
    return this.prisma.user.update({
      where: { id },
      data: { status },
    });
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { orders: true },
    });
  }
}
