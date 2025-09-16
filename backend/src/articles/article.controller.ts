import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ArticleService } from './article.service';

@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  async create(
    @Body('title') title: string,
    @Body('content') content: string,
    @Body('author') author: string,
  ) {
    return this.articleService.create(title, content, author);
  }

  @Get()
  async findAll() {
    return this.articleService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.articleService.findOne(id);
  }
}
