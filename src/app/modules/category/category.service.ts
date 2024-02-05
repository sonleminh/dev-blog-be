import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './entities/category.entity';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
  ) {}

  async createCategory(createCategoryDTO: CreateCategoryDto) {
    try {
      const payload = createCategoryDTO;
      return await this.categoryModel.create(payload);
    } catch (error) {
      throw error;
    }
  }
}
