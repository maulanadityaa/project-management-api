import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Logger } from "winston";
import { TestService } from "./test.service";
import { TestModule } from "./test.module";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";

describe('AuthController', () => {
  let app: INestApplication;
  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService)
  });

  describe('POST /api/v1/auth/register', () => {
    beforeEach(async () => {
      await testService.deleteAll();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          username: '',
          password: '',
          name: '',
        });

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
    });

    it('should be able to register', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          username: 'test',
          password: 'test',
          name: 'test',
        });

      expect(response.status).toBe(201);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
    });

    it('should be rejected if username already exist', async () => {
      await testService.createUser()

      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/register')
        .send({
          username: 'test',
          password: 'test',
          name: 'test',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined()
    });
  })

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          username: '',
          password: '',
        });

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
    });

    it('should be able to login', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          username: 'test',
          password: 'test',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.token).toBeDefined();

      const token = await testService.validateToken(response.body.data.token);
      expect(token.username).toBe('test');
      expect(token.name).toBe('test');
    });

    it('should be rejected if username not found', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          username: 'test1',
          password: 'test',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if password is wrong', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/auth/login')
        .send({
          username: 'test',
          password: 'test1',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });
  })

  describe('PUT /api/v1/auth/update', () => {
    beforeEach(async () => {
      await testService.deleteAll();
      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      const token = await testService.getToken();

      const response = await request(app.getHttpServer())
        .put('/api/v1/auth/update')
        .set('Authorization', `Bearer ${token}`)
        .send({
          username: '',
          name: '',
          password: '',
        });

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
    });

    it('should be able to update', async () => {
      const token = await testService.getToken();

      const response = await request(app.getHttpServer())
        .put('/api/v1/auth/update')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'test1',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('test1');
    });

    it('should be rejected if user is not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .put('/api/v1/auth/update')
        .send({
          name: 'test1',
        });

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });
  })
});
