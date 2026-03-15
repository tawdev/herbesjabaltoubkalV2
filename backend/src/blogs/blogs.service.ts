import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BlogsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.blog.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.blog.findUnique({
      where: { id },
    });
  }

  async create(data: any) {
    return this.prisma.blog.create({ data });
  }

  async update(id: number, data: any) {
    return this.prisma.blog.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.prisma.blog.delete({
      where: { id },
    });
  }
}
