// src/users/user.controller.ts
import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { LoginUserDto } from '../dtos/login-user.dto';
@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() dto: LoginUserDto) {
    return this.userService.login(dto);
  }

  @Get('users')
  async getUsers() {
    return this.userService.findAll();
  }
}
