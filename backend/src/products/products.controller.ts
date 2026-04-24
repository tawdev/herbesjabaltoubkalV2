import { ProductsService } from './products.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
// ProductCategory import removed as it is now a model
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(
    @Query('category') categorySlug?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('search') search?: string,
  ) {
    const parsedMin = minPrice ? parseFloat(minPrice) : undefined;
    const parsedMax = maxPrice ? parseFloat(maxPrice) : undefined;

    return this.productsService.findAll({
      categorySlug,
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

  @Post(':id/reviews')
  addReview(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return this.productsService.addReview(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all/reviews')
  findAllReviews() {
    return this.productsService.findAllReviews();
  }

  @UseGuards(JwtAuthGuard)
  @Delete('reviews/:id')
  deleteReview(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteReview(id);
  }
}
