import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShowsModule } from './shows/shows.module';
import { CastsModule } from './casts/casts.module';
import { MongooseModule } from '@nestjs/mongoose';
import 'dotenv/config';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ShowsModule,
    CastsModule,
    MongooseModule.forRoot(process.env.MONGODB_URL),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
