import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateTagDto, UpdateTagDto } from './dto/tag.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TagService } from './tag.service';
import { TagEntity } from './entities/tag.entity';
import { Types } from 'mongoose';
import { ObjectIdParamDto } from 'src/app/dtos/object-id.dto';

@Controller('tag')
@UseGuards(JwtAuthGuard)
export class TagController {
  constructor(private tagService: TagService) {}

  @Get()
  async getTagList() {
    return this.tagService.findAll();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param() { id }: ObjectIdParamDto) {
    return await this.tagService.findById(id);
  }

  @Post('/')
  async createTag(@Body() createTagDTO: CreateTagDto) {
    return await this.tagService.create(createTagDTO);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(@Param() { id }: { id: string }, @Body() body: UpdateTagDto) {
    return await this.tagService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  async remove(
    @Param() { id }: ObjectIdParamDto,
  ): Promise<{ deletedCount: number }> {
    return await this.tagService.remove(id);
  }
}
