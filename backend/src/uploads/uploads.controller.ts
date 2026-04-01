import { Controller, Post, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('uploads')
export class UploadsController {
  @UseGuards(JwtAuthGuard)
  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), '..', 'frontend', 'public', 'images', 'products'),
        filename: (req: any, file: any, cb: any) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadProductImage(@UploadedFile() file: any) {
    if (!file) {
      return { error: 'No file uploaded' };
    }
    return {
      filename: file.filename,
      path: `images/products/${file.filename}`,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('blog')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), '..', 'frontend', 'public', 'images', 'blogs'),
        filename: (req: any, file: any, cb: any) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadBlogImage(@UploadedFile() file: any) {
    if (!file) {
      return { error: 'No file uploaded' };
    }
    return {
      filename: file.filename,
      path: `images/blogs/${file.filename}`,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('recipe')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join(process.cwd(), '..', 'frontend', 'public', 'images', 'recipes'),
        filename: (req: any, file: any, cb: any) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadRecipeImage(@UploadedFile() file: any) {
    if (!file) {
      return { error: 'No file uploaded' };
    }
    return {
      filename: file.filename,
      path: `images/recipes/${file.filename}`,
    };
  }
}
