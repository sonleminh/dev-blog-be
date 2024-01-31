import { Prop } from '@nestjs/mongoose';

export class CommonEntity {
  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}
