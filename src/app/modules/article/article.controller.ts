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
  Request,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateArticleDto, UpdateArticleDto } from './dto/article.dto';
import { RequestExpress } from 'src/app/interfaces/exception-response.interface';
import { ArticleService } from './article.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from 'src/app/decorators/auth.decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';
import { ObjectIdParamDto } from 'src/app/dtos/object-id.dto';

@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  // @UseGuards(JwtAuthGuard)
  @Get()
  async getArticleList() {
    return this.articleService.getArticleList();
  }

  @UseGuards(JwtAuthGuard)
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
    // @Request() req: RequestExpress,
  ) {
    // const user = req.user;
    // if (!user) throw new Error('User not found');
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
    return await this.articleService.updateArticle(
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
}
