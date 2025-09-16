import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArticleDocument = Document<Article>;

@Schema({ timestamps: true })
export class Article {
  @Prop({ required: true })
  title!: string;

  @Prop()
  content?: string;

  @Prop({ required: true })
  authors!: string; // userId 或用户名
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
