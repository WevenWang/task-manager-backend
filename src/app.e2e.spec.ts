import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './app.module';
import { CreateTaskDto } from './tasks/dto/create-task.dto';
import { UpdateTaskDto } from './tasks/dto/update-task.dto';
import { getConnectionToken } from '@nestjs/mongoose';
import mongoose, { Connection } from 'mongoose';

describe('Tasks API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await mongoose.disconnect();

    await app.close();
  });

  afterEach(async () => {
    try {
      await (app.get(getConnectionToken()) as Connection).collections[
        'tasks'
      ].deleteMany({});
    } catch (error) {}
  });

  it('/tasks (POST)', async () => {
    const createTaskDto: CreateTaskDto = {
      text: 'E2E Test Task',
      category: 'Engineering',
      status: 'Todo',
    };
    const response = await request(app.getHttpServer())
      .post('/tasks')
      .send(createTaskDto)
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.text).toEqual(createTaskDto.text);
    expect(response.body.category).toEqual(createTaskDto.category);
    expect(response.body.status).toEqual(createTaskDto.status);
  });

  it('/tasks (GET)', async () => {
    const createTaskDto: CreateTaskDto = {
      text: 'E2E Test Task',
      category: 'Engineering',
      status: 'Todo',
    };
    await request(app.getHttpServer())
      .post('/tasks')
      .send(createTaskDto)
      .expect(201);
    const response = await request(app.getHttpServer())
      .get('/tasks')
      .expect(200);

    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('/tasks/:id (PATCH)', async () => {
    const updateTaskDto: UpdateTaskDto = {
      text: 'Updated E2E Test Task',
      category: 'Marketing',
      status: 'In Progress',
    };

    // Create a task to update
    const createResponse = await request(app.getHttpServer())
      .post('/tasks')
      .send({
        text: 'Task to update',
        category: 'Engineering',
        status: 'Todo',
      })
      .expect(201);

    const taskId = createResponse.body._id;

    const response = await request(app.getHttpServer())
      .patch(`/tasks/${taskId}`)
      .send(updateTaskDto)
      .expect(200);

    expect(response.body._id).toEqual(taskId);
    expect(response.body.text).toEqual(updateTaskDto.text);
    expect(response.body.category).toEqual(updateTaskDto.category);
    expect(response.body.status).toEqual(updateTaskDto.status);
  });

  it('/tasks/:id (DELETE)', async () => {
    // Create a task to delete
    const createResponse = await request(app.getHttpServer())
      .post('/tasks')
      .send({
        text: 'Task to delete',
        category: 'Engineering',
        status: 'Todo',
      })
      .expect(201);

    const taskId = createResponse.body._id;

    await request(app.getHttpServer()).delete(`/tasks/${taskId}`).expect(200);

    const getResponse = await request(app.getHttpServer())
      .get(`/tasks`)
      .expect(200);

    expect(getResponse.body).toEqual([]);
  });

  it('/tasks (DELETE)', async () => {
    // Create a task to delete
    await request(app.getHttpServer())
      .post('/tasks')
      .send({
        text: 'Task to delete',
        category: 'Engineering',
        status: 'Todo',
      })
      .expect(201);

    await request(app.getHttpServer()).delete(`/tasks`).expect(200);

    const getResponse = await request(app.getHttpServer())
      .get(`/tasks`)
      .expect(200);

    expect(getResponse.body).toEqual([]);
  });

  afterAll(async () => {
    await app.close();
  });
});
