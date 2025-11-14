import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ArticleDocument = HydratedDocument<Article>;

@Schema({ timestamps: true })
export class Article {
  @Prop({ required: true })
  title: string;

  @Prop()
  content: string;

  @Prop({ required: true })
  authorId: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
