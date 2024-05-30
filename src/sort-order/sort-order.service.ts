import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SortOrder } from './entity/sort-order.entity';
import { Model } from 'mongoose';
import { CreateSortOrderDto } from './dto/create-sort-order.dto';
import { UpdateSortOrderDto } from './dto/update-sort-order.dto';

@Injectable()
export class SortOrderService {
  constructor(
    @InjectModel(SortOrder.name) private sortOrderModel: Model<SortOrder>,
  ) {}

  async findAll(): Promise<SortOrder[]> {
    return this.sortOrderModel.find().exec();
  }

  async create(createSortOrderDto: CreateSortOrderDto): Promise<SortOrder> {
    const newSortOrder = new this.sortOrderModel(createSortOrderDto);
    return newSortOrder.save();
  }

  async update(
    status: string,
    updateSortOrderDto: UpdateSortOrderDto,
  ): Promise<SortOrder> {
    const existingSortOrder = await this.sortOrderModel.findOneAndUpdate(
      { status },
      updateSortOrderDto,
      { new: true },
    );
    return existingSortOrder;
  }

  async deleteAll(): Promise<void> {
    await this.sortOrderModel.deleteMany({});
  }
}
