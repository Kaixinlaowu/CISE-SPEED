import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { LoginUserDto } from '../dtos/login-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // register
  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  // login
  @Post('login')
  login(@Body() dto: LoginUserDto) {
    return this.userService.validateUser(dto.username, dto.password);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
