import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SortOrder, SortOrderSchema } from './entity/sort-order.entity';
import { SortOrderController } from './sort-order.controller';
import { SortOrderService } from './sort-order.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SortOrder.name, schema: SortOrderSchema },
    ]),
  ],
  controllers: [SortOrderController],
  providers: [SortOrderService],
})
export class SortOrderModule {}
