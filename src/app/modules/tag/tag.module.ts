import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagEntity, TagSchema } from './entities/tag.entity';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TagEntity.name, schema: TagSchema }]),
  ],
  providers: [TagService],
  controllers: [TagController],
  exports: [TagService],
})
export class TagModule {}
