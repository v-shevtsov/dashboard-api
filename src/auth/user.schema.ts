import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true })
  email: string;
  @Prop()
  passwordHash: string;
  @Prop()
  createdAt?: Date;
  @Prop()
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
