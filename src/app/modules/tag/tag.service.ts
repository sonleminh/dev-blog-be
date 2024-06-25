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
      const [res, total] = await Promise.all([
        this.tagModel.find().lean().exec(),
        this.tagModel.countDocuments(),
      ])
      return { tags: res, total };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async create(createTagDTO: CreateTagDto) {
    console.log(createTagDTO)
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

  async remove(id: string): Promise<{ deletedCount: number }> {
    const entity = await this.tagModel.findById(id).lean();
    if (!entity) {
      throw new NotFoundException('Đối tượng không tồn tại!!');
    }

    const result = await this.tagModel.deleteOne({ _id: id }).exec();

    return {
      deletedCount: result.deletedCount,
    };
  }
}
