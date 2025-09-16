// article.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from '../dtos/create-article.dto';
import { UpdateArticleDto } from '../dtos/update-article.dto';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  async create(@Body() createArticleDto: CreateArticleDto) {
    const article = await this.articleService.create(createArticleDto);
    return article;
  }

  @Get()
  async findAll() {
    const articles = await this.articleService.findAll();
    return articles;
  }

  @Get('search')
  async search(@Query('q') query: string) {
    if (!query) {
      return this.articleService.findAll();
    }
    const articles = await this.articleService.search(query);
    return articles;
  }

  @Get('author/:author')
  async findByAuthor(@Param('author') author: string) {
    const articles = await this.articleService.findByAuthor(author);
    return articles;
  }

  @Get('journal/:journal')
  async findByJournal(@Param('journal') journal: string) {
    const articles = await this.articleService.findByJournal(journal);
    return articles;
  }

  @Get('year/:year')
  async findByYear(@Param('year') year: number) {
    const articles = await this.articleService.findByYear(year);
    return articles;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const article = await this.articleService.findOne(id);
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    const article = await this.articleService.update(id, updateArticleDto);
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  @Put(':id/citations')
  async incrementCitations(@Param('id') id: string) {
    const article = await this.articleService.incrementCitations(id);
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return article;
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const article = await this.articleService.delete(id);
    if (!article) {
      throw new NotFoundException('Article not found');
    }
    return { message: 'Article deleted successfully' };
  }
}
