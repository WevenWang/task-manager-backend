import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Connection } from 'mongoose';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskSchema } from './entity/task.entity';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';

describe('TasksController', () => {
  let app: INestApplication;

  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
      ],
      controllers: [TasksController],
      providers: [TasksService],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
    await app.close();
  });

  afterEach(async () => {
    try {
      await (app.get(getConnectionToken()) as Connection).collections[
        'tasks'
      ].deleteMany({});
    } catch (error) {}
  });

  it('/POST tasks', async () => {
    const createTaskDto: CreateTaskDto = {
      text: 'Test Task',
      category: 'Engineering',
      status: 'Todo',
    };

    const response = await request(app.getHttpServer())
      .post('/tasks')
      .send(createTaskDto)
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.text).toBe(createTaskDto.text);
    expect(response.body.category).toBe(createTaskDto.category);
    expect(response.body.status).toBe(createTaskDto.status);
  });

  it('/GET tasks', async () => {
    const createTaskDto: CreateTaskDto = {
      text: 'Test Task',
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

    expect(response.body).toHaveLength(1);
    expect(response.body[0].text).toBe(createTaskDto.text);
  });

  it('/PATCH tasks/:id', async () => {
    const createTaskDto: CreateTaskDto = {
      text: 'Test Task',
      category: 'Engineering',
      status: 'Todo',
    };
    const createdTask = await request(app.getHttpServer())
      .post('/tasks')
      .send(createTaskDto)
      .expect(201);

    const updateTaskDto: UpdateTaskDto = {
      text: 'Updated Task',
      category: 'Marketing',
      status: 'In Progress',
    };

    const response = await request(app.getHttpServer())
      .patch(`/tasks/${createdTask.body._id}`)
      .send(updateTaskDto)
      .expect(200);

    expect(response.body.text).toBe(updateTaskDto.text);
    expect(response.body.category).toBe(updateTaskDto.category);
    expect(response.body.status).toBe(updateTaskDto.status);
  });

  it('/DELETE tasks/:id', async () => {
    const createTaskDto: CreateTaskDto = {
      text: 'Test Task',
      category: 'Engineering',
      status: 'Todo',
    };
    const createdTask = await request(app.getHttpServer())
      .post('/tasks')
      .send(createTaskDto)
      .expect(201);

    await request(app.getHttpServer())
      .delete(`/tasks/${createdTask.body._id}`)
      .expect(200);

    const response = await request(app.getHttpServer())
      .get('/tasks')
      .expect(200);

    expect(response.body).toHaveLength(0);
  });
});
