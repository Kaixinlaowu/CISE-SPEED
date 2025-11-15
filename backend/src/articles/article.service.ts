import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Article } from './article.schema';
import { Model } from 'mongoose';
import { CreateArticleDto } from '../dtos/create-article.dto';
import { UpdateArticleDto } from '../dtos/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
  ) {}

  async create(dto: CreateArticleDto) {
    const created = new this.articleModel({
      title: dto.title,
      content: dto.content,
      category: dto.category,
      tags: dto.tags || [],
      author: dto.author, // 直接存字符串
    });
    return created.save();
  }

  findAll() {
    return this.articleModel.find();
  }

  async findOne(id: string) {
    const article = await this.articleModel.findById(id);
    if (!article) throw new NotFoundException('Article not found');
    return article;
  }

  update(id: string, dto: UpdateArticleDto) {
    return this.articleModel.findByIdAndUpdate(id, dto, { new: true });
  }

  delete(id: string) {
    return this.articleModel.findByIdAndDelete(id);
  }
}
