import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { SortOrderService } from './sort-order.service';
import { SortOrder } from './entity/sort-order.entity';
import { CreateSortOrderDto } from './dto/create-sort-order.dto';
import { UpdateSortOrderDto } from './dto/update-sort-order.dto';

@Controller('sort-order')
export class SortOrderController {
  constructor(private readonly sortOrderService: SortOrderService) {}

  @Get()
  async findAll(): Promise<SortOrder[]> {
    return this.sortOrderService.findAll();
  }

  @Post()
  async create(
    @Body() createSortOrderDto: CreateSortOrderDto,
  ): Promise<SortOrder> {
    return this.sortOrderService.create(createSortOrderDto);
  }

  @Patch(':status')
  async update(
    @Param('status') status: string,
    @Body() updateSortOrderDto: UpdateSortOrderDto,
  ): Promise<SortOrder> {
    return this.sortOrderService.update(status, updateSortOrderDto);
  }
}
