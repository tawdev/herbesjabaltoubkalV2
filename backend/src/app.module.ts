import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { RecipesModule } from './recipes/recipes.module';
import { OrdersModule } from './orders/orders.module';
import { ContactsModule } from './contacts/contacts.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma.module';
import { BlogsModule } from './blogs/blogs.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [PrismaModule, AuthModule, ProductsModule, RecipesModule, OrdersModule, ContactsModule, BlogsModule, UploadsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
