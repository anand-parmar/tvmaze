import { Module } from '@nestjs/common';
import { ShowsService } from './shows.service';
import { ShowsController } from './shows.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Shows, ShowsSchema } from './shows.schema';
import { HttpModule } from '@nestjs/axios';
import { CastsModule } from '../casts/casts.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Shows.name, schema: ShowsSchema }]),
    HttpModule,
    CastsModule,
  ],
  controllers: [ShowsController],
  providers: [ShowsService],
  exports: [ShowsService],
})
export class ShowsModule {}
