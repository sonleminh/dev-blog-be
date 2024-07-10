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
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';
import { AuthUser } from 'src/app/decorators/auth.decorators';
import { ObjectIdParamDto } from 'src/app/dtos/object-id.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ArticleService } from './article.service';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';

@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Get()
  async getArticleList(@Query() queryParam) {
    return this.articleService.findAll(queryParam);
  }

  @Get('/tag/:id')
  async getArticleListByTag(@Param('id') tag: string, @Query() queryParam) {
    return this.articleService.findByTag(tag, queryParam);
  }

  @Get('/trending')
  async getTredingArticleList() {
    return this.articleService.getTrending();
  }

  @Get('get-article-initial')
  async findInitial() {
    return await this.articleService.getInitialArticleForCreate();
  }

  @Get(':id')
  async getArticleById(@Param('id') id: Types.ObjectId) {
    return this.articleService.getArticleById(id);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('thumbnail_image'))
  @Post('/')
  async createArticle(
    @AuthUser() { id_user },
    @Body() createArticleDTO: CreateArticleDto,
    @UploadedFile() thumbnail_image: Express.Multer.File,
  ) {
    return await this.articleService.createArticle(
      createArticleDTO,
      thumbnail_image,
      id_user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('thumbnail_image'))
  @Patch(':id')
  async updateArticle(
    @Param() { id }: { id: Types.ObjectId },
    @Body() updateArticleDTO: UpdateArticleDto,
    @UploadedFile() thumbnail_image: Express.Multer.File,
  ) {
    return await this.articleService.update(
      id,
      updateArticleDTO,
      thumbnail_image,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  async softDelete(
    @Param() { id }: ObjectIdParamDto,
  ): Promise<{ deleteCount: number }> {
    return await this.articleService.deleteSoft(id);
  }

  @Put(':id/view')
  async increamentView(@Param('id') id: Types.ObjectId) {
    return this.articleService.incrementView(id);
  }
}
