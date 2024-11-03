import { INestApplication } from "@nestjs/common";
import { Logger } from "winston";
import { TestService } from "./test.service";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/app.module";
import { TestModule } from "./test.module";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import * as request from "supertest";

describe('TechnologyController', () => {
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

  describe('POST /api/v1/technologies', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      const token = await testService.getToken();
      console.log(token);

      const response = await request(app.getHttpServer())
        .post('/api/v1/technologies')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '',
        });

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
    });

    it('should be able to create technology', async () => {
      const token = await testService.getToken();

      const response = await request(app.getHttpServer())
        .post('/api/v1/technologies')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'test tech',
        });

      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe('test tech');
    });

    it('should be rejected if user is not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/v1/technologies')
        .send({
          name: 'test tech',
        });

      console.log(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });
  })

  describe('PUT /api/v1/technologies', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createUser();
      await testService.createTech();
    });

    it('should be rejected if request is invalid', async () => {
      const token = await testService.getToken();

      const response = await request(app.getHttpServer())
        .put('/api/v1/technologies')
        .set('Authorization', `Bearer ${token}`)
        .send({
          id: 1,
          name: '',
        });

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
    });

    it('should be able to update technology', async () => {
      const token = await testService.getToken();
      const tech = await testService.getTech();

      const response = await request(app.getHttpServer())
        .put('/api/v1/technologies')
        .set('Authorization', `Bearer ${token}`)
        .send({
          id: tech.id,
          name: 'updated tech',
        });

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('updated tech');
    });

    it('should be rejected if user is not authenticated', async () => {
      const tech = await testService.getTech();

      const response = await request(app.getHttpServer())
        .put('/api/v1/technologies')
        .send({
          id: tech.id,
          name: 'updated tech',
        });

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if technology is not found', async () => {
      const token = await testService.getToken();

      const response = await request(app.getHttpServer())
        .put('/api/v1/technologies')
        .set('Authorization', `Bearer ${token}`)
        .send({
          id: '100',
          name: 'updated tech',
        });

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });
  })

  describe('GET /api/v1/technologies', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createUser();
      await testService.createTech();
    });

    it('should be able to get all technologies', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/technologies')

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('should be able to get technology by id', async () => {
      const tech = await testService.getTech();

      const response = await request(app.getHttpServer())
        .get(`/api/v1/technologies/${tech.id}`)

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('test tech');
    });

    it('should be rejected if technology is not found', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/technologies/100')

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });
  })

  describe('DELETE /api/v1/technologies', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createUser();
      await testService.createTech();
    });

    it('should be able to delete technology', async () => {
      const token = await testService.getToken();
      const tech = await testService.getTech();

      const response = await request(app.getHttpServer())
        .delete(`/api/v1/technologies/${tech.id}`)
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(200);
      expect(response.body.data).toBe(true);
    });

    it('should be rejected if user is not authenticated', async () => {
      const tech = await testService.getTech();

      const response = await request(app.getHttpServer())
        .delete(`/api/v1/technologies/${tech.id}`)

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if technology is not found', async () => {
      const token = await testService.getToken();

      const response = await request(app.getHttpServer())
        .delete('/api/v1/technologies/100')
        .set('Authorization', `Bearer ${token}`)

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });
  })
});