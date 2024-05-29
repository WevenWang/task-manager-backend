import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Task extends Document {
  @Prop()
  text: string;

  @Prop()
  category: string;

  @Prop()
  status: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
