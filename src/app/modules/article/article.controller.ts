import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CreateArticleDto } from './dto/article.dto';
import { RequestExpress } from 'src/app/interfaces/exception-response.interface';
import { ArticleService } from './article.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from 'src/app/decorators/auth.decorators';

@Controller('article')
export class ArticleController {
  constructor(private articleService: ArticleService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createArticle(
    @AuthUser() { id_user },
    @Body() createArticleDTO: CreateArticleDto,
    // @Request() req: RequestExpress,
  ) {
    // const user = req.user;
    // if (!user) throw new Error('User not found');
    return await this.articleService.createArticle(createArticleDTO, id_user);
    // return await this.articleService.createArticle(createArticleDTO);
  }
}
