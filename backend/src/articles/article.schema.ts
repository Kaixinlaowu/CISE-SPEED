// article.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ArticleDocument = Article & Document;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      // 使用更安全的方式删除字段
      const { _id, ...rest } = ret;
      return {
        id: _id.toString(),
        ...rest,
      };
    },
  },
})
export class Article {
  // MongoDB 会自动创建 _id 字段，我们将其映射为 id
  _id: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ type: [String], required: true })
  authors: string[];

  @Prop({ required: true })
  journal: string;

  @Prop({ required: true })
  year: number;

  @Prop()
  doi?: string;

  @Prop()
  abstract?: string;

  @Prop()
  url?: string;

  @Prop({ default: 0 })
  citations?: number;

  // 虚拟字段，用于获取创建时间（由 timestamps 自动生成）
  createdAt: Date;

  // 虚拟字段，用于获取更新时间（由 timestamps 自动生成）
  updatedAt: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

// 添加虚拟字段 id
ArticleSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
