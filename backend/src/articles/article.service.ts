// article.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from './article.schema';
import { CreateArticleDto } from '../dtos/create-article.dto';
import { UpdateArticleDto } from '../dtos/update-article.dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<ArticleDocument> {
    const article = new this.articleModel(createArticleDto);
    return article.save();
  }

  async findAll(): Promise<ArticleDocument[]> {
    return this.articleModel.find().exec();
  }

  async findOne(id: string): Promise<ArticleDocument | null> {
    return this.articleModel.findById(id).exec();
  }

  async findByDoi(doi: string): Promise<ArticleDocument | null> {
    return this.articleModel.findOne({ doi }).exec();
  }

  async findByAuthor(author: string): Promise<ArticleDocument[]> {
    return this.articleModel.find({ authors: author }).exec();
  }

  async findByJournal(journal: string): Promise<ArticleDocument[]> {
    return this.articleModel.find({ journal }).exec();
  }

  async findByYear(year: number): Promise<ArticleDocument[]> {
    return this.articleModel.find({ year }).exec();
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<ArticleDocument | null> {
    return this.articleModel
      .findByIdAndUpdate(id, updateArticleDto, { new: true })
      .exec();
  }

  async incrementCitations(id: string): Promise<ArticleDocument | null> {
    return this.articleModel
      .findByIdAndUpdate(id, { $inc: { citations: 1 } }, { new: true })
      .exec();
  }

  async delete(id: string): Promise<ArticleDocument | null> {
    return this.articleModel.findByIdAndDelete(id).exec();
  }

  async search(query: string): Promise<ArticleDocument[]> {
    return this.articleModel
      .find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { abstract: { $regex: query, $options: 'i' } },
          { journal: { $regex: query, $options: 'i' } },
          { authors: { $in: [new RegExp(query, 'i')] } },
        ],
      })
      .exec();
  }
}
