import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ContactStatus } from '@prisma/client';

@Injectable()
export class ContactsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.contact.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: number) {
    return this.prisma.contact.findUnique({
      where: { id },
    });
  }

  async create(data: any) {
    return this.prisma.contact.create({ data });
  }

  async update(id: number, data: any) {
    return this.prisma.contact.update({
      where: { id },
      data,
    });
  }
}
