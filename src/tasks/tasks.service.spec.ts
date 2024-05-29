import { Test, TestingModule } from '@nestjs/testing';
import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { TasksService } from './tasks.service';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskSchema } from './entity/task.entity';

describe('TasksService', () => {
  let service: TasksService;
  let mongod: MongoMemoryServer;
  let connection: mongoose.Connection;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
      ],
      providers: [TasksService],
    }).compile();

    connection = module.get(getConnectionToken());

    service = module.get<TasksService>(TasksService);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  afterEach(async () => {
    connection.db.dropDatabase();
  });

  it('should create a task', async () => {
    const createTaskDto: CreateTaskDto = {
      text: 'Test Task',
      category: 'Engineering',
      status: 'Todo',
    };
    const task = await service.create(createTaskDto);
    expect(task).toHaveProperty('_id');
    expect(task.text).toBe(createTaskDto.text);
    expect(task.category).toBe(createTaskDto.category);
    expect(task.status).toBe(createTaskDto.status);
  });

  it('should retrieve all tasks', async () => {
    const createTaskDto: CreateTaskDto = {
      text: 'Test Task',
      category: 'Engineering',
      status: 'Todo',
    };
    await service.create(createTaskDto);
    const tasks = await service.findAll();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].text).toBe(createTaskDto.text);
  });

  it('should update a task', async () => {
    const createTaskDto: CreateTaskDto = {
      text: 'Test Task',
      category: 'Engineering',
      status: 'Todo',
    };
    const createdTask = await service.create(createTaskDto);

    const updateTaskDto: UpdateTaskDto = {
      text: 'Updated Task',
      category: 'Marketing',
      status: 'In Progress',
    };

    const updatedTask = await service.update(
      createdTask._id as string,
      updateTaskDto,
    );
    expect(updatedTask.text).toBe(updateTaskDto.text);
    expect(updatedTask.category).toBe(updateTaskDto.category);
    expect(updatedTask.status).toBe(updateTaskDto.status);
  });

  it('should delete a task', async () => {
    const createTaskDto: CreateTaskDto = {
      text: 'Test Task',
      category: 'Engineering',
      status: 'Todo',
    };
    const createdTask = await service.create(createTaskDto);
    await service.delete(createdTask._id as string);
    const tasks = await service.findAll();
    expect(tasks).toHaveLength(0);
  });
});
