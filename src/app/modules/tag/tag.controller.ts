import {
  Body,
  Controller,
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
export class TagController {
  constructor(private tagService: TagService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getArticleList() {
    return this.tagService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createTag(@Body() createTagDTO: CreateTagDto) {
    return await this.tagService.createTag(createTagDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  // @HttpCode(HttpStatus.CREATED)
  async update(@Param() { id }: { id: string }, @Body() body: UpdateTagDto) {
    return await this.tagService.update(id, body);
  }
}
