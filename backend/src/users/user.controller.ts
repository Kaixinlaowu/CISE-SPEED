// user.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UsePipes,
  ValidationPipe,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';
import { excludePassword, toObjectIfNeeded } from '../utils/transform.util';

@Controller('users')
@UsePipes(new ValidationPipe({ transform: true }))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.create(createUserDto);
      return excludePassword(toObjectIfNeeded(user));
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new ConflictException('Failed to create user');
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto) {
    console.log(loginUserDto);
    const user = await this.userService.validateUserCredentials(
      loginUserDto.email,
      loginUserDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 使用 _id 而不是 id
    await this.userService.updateLastLogin(user._id.toString());

    return excludePassword(toObjectIfNeeded(user));
  }

  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return users.map((user) => excludePassword(toObjectIfNeeded(user)));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return excludePassword(toObjectIfNeeded(user));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(id, updateUserDto);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return excludePassword(toObjectIfNeeded(user));
  }

  @Put(':id/last-login')
  async updateLastLogin(@Param('id') id: string) {
    const user = await this.userService.updateLastLogin(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return excludePassword(toObjectIfNeeded(user));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    const user = await this.userService.delete(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  }

  @Put(':id/deactivate')
  async deactivate(@Param('id') id: string) {
    const user = await this.userService.deactivate(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return excludePassword(toObjectIfNeeded(user));
  }
}
