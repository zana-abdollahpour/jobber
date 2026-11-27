import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import type { GqlContext } from '@jobber/graphql';

import { User } from '../../users/models/user.model';

import { LoginInput } from './dtos/login.input';
import { AuthenticationService } from './authentication.service';

@Resolver()
export class AuthenticationResolver {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Mutation(() => User)
  async login(
    @Args('loginInput') loginInput: LoginInput,
    @Context() context: GqlContext,
  ) {
    return this.authenticationService.login(loginInput, context.res);
  }
}
