import { Module } from '@nestjs/common';
import { CastsService } from './casts.service';
import { CastsController } from './casts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Casts, CastsSchema } from './casts.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Casts.name, schema: CastsSchema }]),
  ],
  controllers: [CastsController],
  providers: [CastsService],
  exports: [CastsService],
})
export class CastsModule {}
