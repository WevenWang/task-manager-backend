import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

import { getConnectionToken, MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Connection } from 'mongoose';

import { CreateSortOrderDto } from './dto/create-sort-order.dto';
import { UpdateSortOrderDto } from './dto/update-sort-order.dto';
import { SortOrder, SortOrderSchema } from './entity/sort-order.entity';
import { SortOrderService } from './sort-order.service';
import { SortOrderController } from './sort-order.controller';

describe('SortOrderController', () => {
  let app: INestApplication;

  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([
          { name: SortOrder.name, schema: SortOrderSchema },
        ]),
      ],
      controllers: [SortOrderController],
      providers: [SortOrderService],
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
        'sortorders'
      ].deleteMany({});
    } catch (error) {}
  });

  // Your tests go here

  it('should successfully create a sort order', async () => {
    const createSortOrderDto: CreateSortOrderDto = {
      status: 'Todo',
      taskIds: ['1', '2', '3'],
    };

    const response = await request(app.getHttpServer())
      .post('/sort-orders')
      .send(createSortOrderDto)
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.status).toBe(createSortOrderDto.status);
    expect(response.body.taskIds).toEqual(createSortOrderDto.taskIds);
  });

  it('cannot create a duplicate sort order with the same status', async () => {
    const createSortOrderDto: CreateSortOrderDto = {
      status: 'Todo',
      taskIds: ['1', '2', '3'],
    };

    await request(app.getHttpServer())
      .post('/sort-orders')
      .send(createSortOrderDto)
      .expect(201);

    await request(app.getHttpServer())
      .post('/sort-orders')
      .send(createSortOrderDto)
      .expect(500);
  });

  it('should successfully update a sort order by status', async () => {
    const createSortOrderDto: CreateSortOrderDto = {
      status: 'Todo',
      taskIds: ['1', '2', '3'],
    };

    const createResponse = await request(app.getHttpServer())
      .post('/sort-orders')
      .send(createSortOrderDto)
      .expect(201);

    const updateSortOrderDto: UpdateSortOrderDto = {
      taskIds: ['4', '5', '6'],
    };

    const response = await request(app.getHttpServer())
      .patch(`/sort-orders/${createResponse.body.status}`)
      .send(updateSortOrderDto)
      .expect(200);

    expect(response.body.status).toBe(createResponse.body.status);
    expect(response.body.taskIds).toEqual(updateSortOrderDto.taskIds);
  });

  it('should successfully retrieve all sort orders', async () => {
    const createSortOrderDto: CreateSortOrderDto = {
      status: 'Todo',
      taskIds: ['1', '2', '3'],
    };

    await request(app.getHttpServer())
      .post('/sort-orders')
      .send(createSortOrderDto)
      .expect(201);

    const response = await request(app.getHttpServer())
      .get('/sort-orders')
      .expect(200);

    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should successfully delete all sort orders', async () => {
    const createSortOrderDto: CreateSortOrderDto = {
      status: 'Todo',
      taskIds: ['1', '2', '3'],
    };

    await request(app.getHttpServer())
      .post('/sort-orders')
      .send(createSortOrderDto)
      .expect(201);

    await request(app.getHttpServer()).delete('/sort-orders').expect(200);

    const response = await request(app.getHttpServer())
      .get('/sort-orders')
      .expect(200);

    expect(response.body.length).toBe(0);
  });
});
