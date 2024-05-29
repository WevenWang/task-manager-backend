import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class SortOrder {
  @Prop()
  taskIds: string[];

  @Prop({ unique: true })
  status: string;
}

const SortOrderSchema = SchemaFactory.createForClass(SortOrder);
SortOrderSchema.index({ status: 1 }, { unique: true });

export { SortOrderSchema };
