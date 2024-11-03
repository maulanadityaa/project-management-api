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

  describe('POST /api/v1/projects', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createUser();
      await testService.createTech();
    });

    it('should be rejected if request is invalid', async () => {
      const token = await testService.getToken();
      console.log(token);

      const response = await request(app.getHttpServer())
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '',
          description: '',
          image: '',
        });

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
    });

    it('should be able to create project', async () => {
      const token = await testService.getToken();
      const tech = await testService.getTech();
      const image = await testService.getNewImageFile()

      const response = await request(app.getHttpServer())
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${token}`)
        .field('name', 'test project')
        .field('description', 'test description')
        .field('technologies', [tech.id])
        .attach('image', image)

      expect(response.status).toBe(201);
      expect(response.body.data.name).toBe('test project');3
      expect(response.body.data.description).toBe('test description');
      expect(response.body.data.technologies.length).toBe(1);
      expect(response.body.data.imageUrl).toBeDefined();

    });

    it('should be rejected if user is not authenticated', async () => {
      const tech = await testService.getTech();
      const image = await testService.getNewImageFile()

      const response = await request(app.getHttpServer())
        .post('/api/v1/projects')
        .set('Authorization', `Bearer ${''}`)
        .field('name', 'test project')
        .field('description', 'test description')
        .field('technologies', [tech.id])

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });
  })

  describe('PUT /api/v1/projects', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createUser();
      await testService.createTech();
      await testService.createProject();
    });

    jest.setTimeout(30000);

    it('should be rejected if request is invalid', async () => {
      const token = await testService.getToken();

      const response = await request(app.getHttpServer())
        .put('/api/v1/projects')
        .set('Authorization', `Bearer ${token}`)
        .send({
          id: '1',
          name: '',
        });

      expect(response.status).toBe(400);
      expect(response.body).toBeDefined();
    });

    it('should be able to update project', async () => {
      const token = await testService.getToken();
      const tech = await testService.getTech();
      const image = await testService.getNewImageFile()
      const project = await testService.getProject()

      const response = await request(app.getHttpServer())
        .put('/api/v1/projects')
        .set('Authorization', `Bearer ${token}`)
        .field('id', project.id)
        .field('name', 'updated project')
        .field('description', 'updated description')
        .field('technologies', [tech.id])
        .attach('image', image)

      console.log(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('updated project');
      expect(response.body.data.description).toBe('updated description');
      expect(response.body.data.technologies.length).toBe(1);
      expect(response.body.data.imageUrl).toBeDefined();
    });

    it("should be rejected if user is not authenticated", async () => {
      const tech = await testService.getTech();
      const image = await testService.getNewImageFile()
      const project = await testService.getProject()

      const response = await request(app.getHttpServer())
        .put('/api/v1/projects')
        .field('id', project.id)
        .field('name', 'test project')
        .field('description', 'test description')
        .field('technologies[]', tech.id)

      console.log(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });
  })

  describe('GET /api/v1/projects/:projectId', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createUser();
      await testService.createTech();
      await testService.createProject();
    });

    it('should be able to get project', async () => {
      const project = await testService.getProject();

      const response = await request(app.getHttpServer())
        .get(`/api/v1/projects/${project.id}`)

      expect(response.status).toBe(200);
      expect(response.body.data.name).toBe('test project');
      expect(response.body.data.description).toBe('test description');
      expect(response.body.data.technologies.length).toBe(1);
      expect(response.body.data.imageUrl).toBeDefined();
    });

    it('should be rejected if project is not found', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/projects/100`)

      expect(response.status).toBe(404);
      expect(response.body.errors).toBeDefined();
    });
  })

  describe('GET(Search) /api/v1/projects', () => {
    beforeEach(async () => {
      await testService.deleteAll();

      await testService.createUser();
      await testService.createTech();
      await testService.createProject();
    });

    it('should be able to search projects', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/v1/projects`)
        .query({
          name: 'test'
        })

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].name).toBe('test project');
      expect(response.body.data[0].description).toBe('test description');
      expect(response.body.data[0].technologies.length).toBe(1);
      expect(response.body.data[0].imageUrl).toBeDefined();
      expect(response.body.data[0].userResponse).toBeDefined();
      expect(response.body.data[0].userResponse.username).toBe('test');
      expect(response.body.data[0].userResponse.name).toBe('test');
    });

    it('should be able to search projects by technology', async () => {
      const tech = await testService.getTech();

      const response = await request(app.getHttpServer())
        .get(`/api/v1/projects`)
        .query({
          'techs[]': tech.name
        })

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].name).toBe('test project');
      expect(response.body.data[0].description).toBe('test description');
      expect(response.body.data[0].technologies.length).toBe(1);
      expect(response.body.data[0].imageUrl).toBeDefined();
      expect(response.body.data[0].userResponse).toBeDefined();
      expect(response.body.data[0].userResponse.username).toBe('test');
      expect(response.body.data[0].userResponse.name).toBe('test');
    });

    it("should be able to search projects with paging", async () => {
      const tech = await testService.getTech();

      const response = await request(app.getHttpServer())
        .get(`/api/v1/projects`)
        .query({
          'techs[]': tech.name,
          page: 1,
          size: 10,
        })

      console.log(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].name).toBe('test project');
      expect(response.body.data[0].description).toBe('test description');
      expect(response.body.data[0].technologies.length).toBe(1);
      expect(response.body.data[0].imageUrl).toBeDefined();
      expect(response.body.data[0].userResponse).toBeDefined();
      expect(response.body.data[0].userResponse.username).toBe('test');
      expect(response.body.data[0].userResponse.name).toBe('test');
      expect(response.body.paging.currentPage).toBe(1);
      expect(response.body.paging.totalPage).toBe(1);
      expect(response.body.paging.size).toBe(10);
      expect(response.body.paging.totalRows).toBe(1);
    });

    it('should be able to list all projects', async () => {

      const response = await request(app.getHttpServer())
        .get(`/api/v1/projects`)

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });
  })
});