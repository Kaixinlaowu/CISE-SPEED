import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
@Schema({ timestamps: true }) // 自动添加 createdAt / updatedAt
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
