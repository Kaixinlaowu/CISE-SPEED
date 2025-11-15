// src/users/user.service.ts
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema'; // 正确导入
import { LoginUserDto } from '../dtos/login-user.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/dtos/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /** 登录 */
  async login(dto: LoginUserDto) {
    // 1. 查找用户（用 username）
    const user = await this.userModel.findOne({ username: dto.username });
    if (!user) {
      throw new BadRequestException('用户名或密码错误');
    }

    // 2. 验证密码
    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new BadRequestException('用户名或密码错误');
    }

    // 3. 返回安全数据（不暴露 password）
    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email, // 可能为 undefined
      },
    };
  }

  /** 获取所有用户（隐藏密码） */
  async findAll() {
    return this.userModel.find().select('-password').exec();
  }

  /** 创建用户 */
  async create(createUserDto: CreateUserDto) {
    // 防止重复用户名
    const existing = await this.userModel.findOne({
      username: createUserDto.username,
    });
    if (existing) {
      throw new BadRequestException('用户名已存在');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // 创建用户
    const createdUser = await this.userModel.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // 返回时隐藏密码
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = createdUser.toObject();
    return result;
  }

  /** （可选）根据 ID 查找用户 */
  async findOne(id: string) {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) {
      throw new NotFoundException('用户不存在');
    }
    return user;
  }
}
