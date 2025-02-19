// src/users/users.resolver.ts
import { Resolver, Query, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './users.model';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  async users() {
    return this.usersService.findAll();
  }

  @Query(() => User, { nullable: true })
  async user(@Args('id') id: string) {
    return this.usersService.findOne(id);
  }
}
