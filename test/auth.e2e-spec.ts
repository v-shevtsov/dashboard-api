import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { disconnect } from 'mongoose';
import { AuthDto } from '../src/auth/dto/auth.dto';

const loginDto: AuthDto = {
  email: 'test@mail.com',
  password: '1',
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/review/create (POST) - success', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200);

    expect(body.access_token).toBeDefined();
    authToken = body.access_token;
  });

  it('/auth/login (POST) - failed password', () => {
    request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, password: '42' })
      .expect(401, {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized',
      });
  });

  it('/auth/login (POST) - failed email', () => {
    request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, email: '42@mail.com' })
      .expect(401, {
        statusCode: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized',
      });
  });

  afterAll(() => {
    disconnect();
    app.close();
  });
});
