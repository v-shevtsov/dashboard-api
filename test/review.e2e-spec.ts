import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { Types, disconnect } from 'mongoose';
import { REVIEW_RESPONSE_MAP } from '../src/review/review.constants';
import { AuthDto } from '../src/auth/dto/auth.dto';

const productId = new Types.ObjectId().toHexString();

const loginDto: AuthDto = {
  email: 'test@mail.com',
  password: '1',
};

const mockCreateReviewDto: CreateReviewDto = {
  name: 'Test',
  title: 'Title test',
  description: 'Description test',
  rating: 5,
  productId,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('ReviewController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let authToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);
    authToken = body.access_token;
  });

  it('/review/create (POST) - success', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/review/create')
      .send(mockCreateReviewDto)
      .expect(201);

    createdId = body._id;
    expect(createdId).toBeDefined();
  });

  it('/review/create (POST) - failed', () => {
    request(app.getHttpServer())
      .post('/review/create')
      .send({
        ...mockCreateReviewDto,
        rating: 0,
      })
      .expect(400);
  });

  it('/review/byProduct/:productId (GET) - success', () => {
    request(app.getHttpServer())
      .get('/review/byProduct/' + productId)
      .set('Authorization', 'Bearer ' + authToken)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(1);
      });
  });

  it('/review/byProduct/:productId (GET) - failed', () => {
    request(app.getHttpServer())
      .get('/review/byProduct/' + new Types.ObjectId().toHexString())
      .set('Authorization', 'Bearer ' + authToken)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(0);
      });
  });

  it('/review/:id (DELETE) - success', () => {
    request(app.getHttpServer())
      .delete('/review/' + createdId)
      .set('Authorization', 'Bearer ' + authToken)
      .expect(200);
  });

  it('/review/:id (DELETE) - failed', () => {
    request(app.getHttpServer())
      .delete('/review/' + createdId)
      .set('Authorization', 'Bearer ' + authToken)
      .expect(404, {
        statusCode: 404,
        message: REVIEW_RESPONSE_MAP.REVIEW_NOT_FOUND,
      });
  });

  afterAll(() => {
    disconnect();
    app.close();
  });
});
