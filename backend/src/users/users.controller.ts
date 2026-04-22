import { Controller, Get, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  // @UseGuards(AuthGuard('jwt')) // Uncomment for production
  async findAll() {
    return this.usersService.findAll();
  }

  @Patch(':id/status')
  // @UseGuards(AuthGuard('jwt')) // Uncomment for production
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.usersService.updateStatus(+id, status);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
}
