import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTagDto, UpdateTagDto } from './dto/tag.dto';
import { TagEntity } from './entities/tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectModel(TagEntity.name) private tagModel: Model<TagEntity>,
  ) {}

  async findAll() {
    try {
      return await this.tagModel.find().lean().exec();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async createTag(createTagDTO: CreateTagDto) {
    try {
      const payload = createTagDTO;
      return await this.tagModel.create(payload);
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, body: UpdateTagDto): Promise<TagEntity> {
    const entity = await this.tagModel
      .findOne({ _id: id })
      .where({ is_deleted: { $ne: true } })
      .lean();
    if (!entity) {
      throw new NotFoundException(`Đối tượng này không tồn tại!!`);
    }

    return await this.tagModel
      .findByIdAndUpdate(id, { ...entity, ...body }, { new: true })
      .exec();
  }
}
