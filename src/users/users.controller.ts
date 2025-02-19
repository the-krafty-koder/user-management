import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  UsePipes,
  ValidationPipe,
  Param,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(
    @Query('limit') limit?: number,
    @Query('startAfter') startAfter?: string,
  ) {
    const { users, nextPageToken } = await this.usersService.findAll(
      limit ? Number(limit) : 10,
      startAfter,
    );
    return {
      users,
      nextPageToken,
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe())
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
}
