import { ProductsService } from './products.service';
import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ProductCategory } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(
    @Query('category') category?: ProductCategory,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('search') search?: string,
  ) {
    const validCategories = Object.values(ProductCategory);
    let safeCategory = undefined;
    if (category && typeof category === 'string' && validCategories.includes(category as ProductCategory)) {
      safeCategory = category;
    }

    const parsedMin = minPrice ? parseFloat(minPrice) : undefined;
    const parsedMax = maxPrice ? parseFloat(maxPrice) : undefined;

    return this.productsService.findAll({
      category: safeCategory,
      minPrice: Number.isNaN(parsedMin) ? undefined : parsedMin,
      maxPrice: Number.isNaN(parsedMax) ? undefined : parsedMax,
      search: typeof search === 'string' ? search : undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() data: any) {
    return this.productsService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.productsService.update(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
