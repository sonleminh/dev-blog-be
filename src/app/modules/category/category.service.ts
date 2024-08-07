import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/category.dto';
import { CategoryEntity } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(CategoryEntity.name) private categoryModel: Model<CategoryEntity>,
  ) {}

  async findAll() {
    try {
      const [res, total] = await Promise.all([
        this.categoryModel.find().lean().exec(),
        this.categoryModel.countDocuments(),
      ])
      return { categories: res, total };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findById(id: string) {
    return await this.categoryModel.findById(id);
  }

  async create(createCategoryDTO: CreateCategoryDto) {
    try {
      const payload = createCategoryDTO;
      return await this.categoryModel.create(payload);
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, body: any): Promise<CategoryEntity> {
    const entity = await this.categoryModel
      .findById({ _id: id })
      .where({ is_deleted: { $ne: true } })
      .lean();
    if (!entity) {
      throw new NotFoundException(`Đối tượng này không tồn tại!!`);
    }

    return await this.categoryModel
      .findByIdAndUpdate(id, { ...entity, ...body }, { new: true })
      .exec();
  }

  async remove(id: string): Promise<{ deletedCount: number }> {
    const entity = await this.categoryModel.findById(id).lean();
    if (!entity) {
      throw new NotFoundException('Đối tượng không tồn tại!!');
    }

    const result = await this.categoryModel.deleteOne({ _id: id }).exec();

    return {
      deletedCount: result.deletedCount,
    };
  }
}
