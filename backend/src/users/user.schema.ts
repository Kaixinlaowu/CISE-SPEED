// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  // MongoDB 会自动创建 _id 字段，我们将其映射为 id
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string; // 添加密码字段

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

// 添加密码加密中间件
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (error) {
    next(error);
  }
});

// 添加实例方法用于密码验证
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return bcrypt.compare(candidatePassword, this.password);
};
