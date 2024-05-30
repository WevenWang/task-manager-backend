import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional } from 'class-validator';
import { Document } from 'mongoose';

@Schema()
export class Task extends Document {
  @Prop()
  text: string;

  @Prop()
  category: string;

  @Prop()
  status: string;

  @Prop()
  markAsDone?: boolean;
}

const TaskSchema = SchemaFactory.createForClass(Task);
TaskSchema.set('timestamps', true);

export { TaskSchema };
