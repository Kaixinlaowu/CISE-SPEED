// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  // MongoDB 会自动创建 _id 字段，我们将其映射为 id
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({
    required: true,
    enum: ['admin', 'editor', 'viewer'],
    default: 'viewer',
  })
  role: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  lastLogin?: Date;
  // 虚拟字段，用于获取创建时间（由 timestamps 自动生成）
  createdAt: Date;

  // 虚拟字段，用于获取更新时间（由 timestamps 自动生成）
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
