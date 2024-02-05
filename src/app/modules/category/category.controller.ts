import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createCategory(@Body() createCategoryDTO: CreateCategoryDto) {
    return await this.categoryService.createCategory(createCategoryDTO);
  }
}
