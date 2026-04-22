import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async findMyOrders(@Request() req: any) {
    const userId = Number(req.user?.userId);
    console.log('[DEBUG] GET /orders/my - UserID:', userId, 'Raw User:', JSON.stringify(req.user));
    
    if (isNaN(userId)) {
      console.error('[ERROR] Invalid UserID in JWT payload');
      return [];
    }
    
    return this.ordersService.findByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  getStats() {
    return this.ordersService.getStats();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Post()
  async create(@Body() data: any, @Request() req: any) {
    // If user is logged in (has a valid token), associate the order
    // Note: We don't use @UseGuards here if we want to allow guest orders,
    // but the token might be in the headers. Strategy: check if req.user exists
    const userId = req.user?.userId ? Number(req.user.userId) : undefined;
    return this.ordersService.create(data, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: OrderStatus,
  ) {
    return this.ordersService.updateStatus(id, status);
  }
}
