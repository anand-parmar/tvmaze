import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { ShowsModule } from '../src/shows/shows.module';
import { MongooseModule } from '@nestjs/mongoose';
import 'dotenv/config';

describe('ShowsController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MongooseModule.forRoot(process.env.MONGODB_URL), ShowsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // test get shows
  it('/shows/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/shows/')
      .expect(200)
      .expect(({ body }) => {
        expect(body.shows).toBeDefined();
        expect(body.totalShows).toBeDefined();
        expect(body.totalPages).toBeDefined();
        expect(body.currentPage).toBe(1);
      })
      .expect(HttpStatus.OK);
  });

  afterAll(async () => {
    await app.close();
  });
});
