import { Prop,Schema, SchemaFactory } from "@nestjs/mongoose";
import { Transform } from "class-transformer";
import { Document,HydratedDocument,Types } from "mongoose";

@Schema({collection: 'user', timestamps: true})
export class User extends Document {
    @Transform(({value}) => value.toString())
    _id?: Types.ObjectId;

    @Prop({ require: true, unique: true})
    username: string;

    @Prop({ require: true, trim: true})
    password: string;
}   

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);