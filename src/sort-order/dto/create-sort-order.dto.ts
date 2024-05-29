import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export class CreateSortOrderDto {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString({ each: true })
  @IsArray()
  taskIds: string[];
}
