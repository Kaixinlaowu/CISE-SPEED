import { Prop, SchemaFactory } from '@nestjs/mongoose';

export class Article {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  category: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true })
  author: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
