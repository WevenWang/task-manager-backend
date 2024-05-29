import { PartialType } from '@nestjs/mapped-types';
import { CreateSortOrderDto } from './create-sort-order.dto';

export class UpdateSortOrderDto extends PartialType(CreateSortOrderDto) {}
