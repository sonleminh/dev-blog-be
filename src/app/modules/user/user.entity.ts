import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Transform(({ value }) => value.toString())
  _id?: Types.ObjectId;

  @Prop({ require: true, unique: true })
  username: string;

  @Prop({ require: true })
  name: string;

  @Prop({ require: true, trim: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
