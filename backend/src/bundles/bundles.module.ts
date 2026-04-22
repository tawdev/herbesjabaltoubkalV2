import { Module } from '@nestjs/common';
import { BundlesService } from './bundles.service';
import { BundlesController } from './bundles.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [BundlesController],
  providers: [BundlesService],
})
export class BundlesModule {}
