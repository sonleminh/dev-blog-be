import {
  Body,
  Controller,
  Get,
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

@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @UseGuards(JwtAuthGuard)
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
  @Patch(':id')
  async updateArticle(
    @Body() updateArticleDTO: UpdateArticleDto,
    @Param() { id }: { id: Types.ObjectId },
  ) {
    return await this.articleService.updateArticle(updateArticleDTO, id);
  }

  // @Post('/upload')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   return await this.articleService.create(file);
  // }
}
