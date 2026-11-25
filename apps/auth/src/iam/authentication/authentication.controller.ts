import { Controller, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';

import {
  User,
  AuthServiceController,
  AuthServiceControllerMethods,
  type AuthenticateRequest,
} from '../../../../../types/proto/auth';

import { UsersService } from '../../users/users.service';

import { JwtAuthGuard } from './guards/jet-auth.guard';
import { TokenPayload } from './interfaces/token-payload.interface';

@Controller()
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  authenticate(
    request: AuthenticateRequest & { user: TokenPayload },
  ): Promise<User> | Observable<User> | User {
    return this.usersService.getUser({ id: request.user.userId });
  }
}
