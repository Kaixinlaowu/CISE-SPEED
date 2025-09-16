import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(
    @Body('username') username: string,
    @Body('password') password: string,
    @Body('email') email?: string,
  ) {
    return this.userService.create(username, password, email);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':username')
  async findOne(@Param('username') username: string) {
    return this.userService.findOne(username);
  }
}
