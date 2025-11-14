import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(data: CreateUserDto): Promise<User> {
    const created = new this.userModel(data);
    return created.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password');
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, data, {
        new: true,
      })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return updatedUser;
  }

  async delete(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    return this.userModel.findOne({ username, password });
  }
}
