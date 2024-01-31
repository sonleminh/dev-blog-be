import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CreateArticleDto } from './dto/article.dto';
import { RequestExpress } from 'src/app/interfaces/exception-response.interface';
import { ArticleService } from './article.service';
import { AuthGuard } from '../auth/guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @Post('/')
  async createArticle(
    @Body() createArticleDTO: CreateArticleDto,
    @Request() req: RequestExpress,
  ) {
    const user = req.user;
    if (!user) throw new Error('User not found');
    return await this.articleService.createArticle(createArticleDTO, user);
  }
}
