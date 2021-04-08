import { Controller, Get, Res, HttpStatus, Post, Body, Param, ParseUUIDPipe, Put, Query } from '@nestjs/common';
import { ValidationPipe } from 'src/shared/pipes/validation.pipe';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { ListQuery } from './interfaces/list-query.type';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUsers(@Res() res, @Query() query: ListQuery) {
    const users = await this.userService.getUsers(query);

    return res.status(HttpStatus.OK).json(users);
  }

  @Get(':userId')
  async getUserById(@Res() res, @Param('userId', new ParseUUIDPipe()) userId) {
    const user = await this.userService.getUserById(userId);

    return res.status(HttpStatus.OK).json(user);
  }

  @Post()
  async createUser(@Res() res, @Body(new ValidationPipe()) dto: CreateUserDTO) {
    const user = await this.userService.createUser(dto);

    return res.status(HttpStatus.OK).json(user);
  }

  @Put(':userId')
  async updateUser(
    @Res() res,
    @Param('userId', new ParseUUIDPipe()) userId,
    @Body(new ValidationPipe()) dto: UpdateUserDTO,
  ) {
    const user = await this.userService.updateUser(userId, dto);

    return res.status(HttpStatus.OK).json(user);
  }
}
